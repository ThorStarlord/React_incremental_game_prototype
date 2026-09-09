const crypto = require('crypto');

function sha256(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return crypto.createHash('sha256').update(text).digest('hex');
}

function normalizeControl(control) {
  return {
    controlNumber: Number(control.controlNumber),
    tag: control.tag || null,
    role: control.role || null,
    type: control.type || null,
    text: control.text || '',
    ariaLabel: control.ariaLabel || null,
    placeholder: control.placeholder || null,
    href: control.href || null,
  };
}

function observationId(sequence) {
  return `O${String(sequence).padStart(3, '0')}`;
}

function bindControls(sequence, controls) {
  const normalized = controls.map(normalizeControl);
  const controlSetDigest = sha256(normalized);
  const obsId = observationId(sequence);
  const bound = normalized.map((control) => {
    const suffix = sha256({ obsId, controlSetDigest, control }).slice(0, 8).toUpperCase();
    return {
      ...control,
      actionId: `${obsId}-C${String(control.controlNumber).padStart(3, '0')}-${suffix}`,
    };
  });
  return { observationId: obsId, controlSetDigest, controls: bound };
}

function validateBoundAction(actionId, deliveredObservation, currentControls) {
  if (!deliveredObservation || !deliveredObservation.sequence) {
    return { ok: false, code: 'NO_DELIVERED_OBSERVATION' };
  }

  const expected = deliveredObservation.controls.find((control) => control.actionId === actionId);
  if (!expected) {
    return { ok: false, code: 'INVALID_ACTION_ID' };
  }

  const rebound = bindControls(deliveredObservation.sequence, currentControls);
  if (rebound.controlSetDigest !== deliveredObservation.controlSetDigest) {
    return {
      ok: false,
      code: 'ACTION_REJECTED_STALE_OR_MISMATCHED',
      expectedControlSetDigest: deliveredObservation.controlSetDigest,
      currentControlSetDigest: rebound.controlSetDigest,
    };
  }

  const current = rebound.controls.find((control) => control.actionId === actionId);
  if (!current) {
    return { ok: false, code: 'ACTION_REJECTED_STALE_OR_MISMATCHED' };
  }

  return {
    ok: true,
    code: 'ACTION_BINDING_VALID',
    controlNumber: expected.controlNumber,
    control: current,
  };
}

module.exports = {
  sha256,
  normalizeControl,
  observationId,
  bindControls,
  validateBoundAction,
};
