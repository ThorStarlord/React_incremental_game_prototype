declare module 'react-resizable' {
  import * as React from 'react';

  export interface ResizableBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    width: number;
    height: number;
    axis?: 'both' | 'x' | 'y' | 'none';
    handle?: React.ReactElement | ((resizeHandle: string) => React.ReactElement);
    handleSize?: [number, number];
    lockAspectRatio?: boolean;
    maxConstraints?: [number, number];
    minConstraints?: [number, number];
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
    transformScale?: number;
    onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
  }

  export interface ResizeCallbackData {
    node: HTMLElement;
    size: { width: number; height: number };
    handle: string;
  }

  export class Resizable extends React.Component<any> {}
  export class ResizableBox extends React.Component<ResizableBoxProps> {}
}
