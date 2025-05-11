'use client';

import { ReactNode } from 'react';
import { IPoint } from 'src/lib/interface/point.interface';
import { OverlayView } from '@react-google-maps/api';

export default function GoogleMarker({ position, children }: { position: IPoint; children: ReactNode }) {
  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      {children}
    </OverlayView>
  );
}
