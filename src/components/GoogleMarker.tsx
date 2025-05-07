'use client';

import { IPoint } from '@/lib/interface/point.interface';
import { OverlayView } from '@react-google-maps/api';
import { ReactNode } from 'react';

export default function GoogleMarker({ position, children }: { position: IPoint; children: ReactNode }) {
  return (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      {children}
    </OverlayView>
  );
}
