import React from 'react';

interface BreadcrumbNavProps {
  /**
   * Enable test mode with sample paths
   */
  testMode?: boolean;
}

/**
 * An enhanced navigation breadcrumb component that shows the current location path
 * in the application as a series of clickable links with custom styling and icons.
 */
declare const BreadcrumbNav: React.FC<BreadcrumbNavProps>;

export default BreadcrumbNav;
