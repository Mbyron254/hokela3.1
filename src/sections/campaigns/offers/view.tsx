
import React from 'react';
import { Box, Typography } from '@mui/material';

type Offer = {
  id: string;
  title: string;
  description: string;
  status: string;
};

type Props = {
  offers: Offer[];
};

export function CampaignOffersView({ offers }: Props) {
  return (
    <Box>
      {offers.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No offers available
        </Typography>
      ) : (
        offers.map((offer) => (
          <Box key={offer.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Typography variant="h6">{offer.title}</Typography>
            <Typography variant="body2">{offer.description}</Typography>
            <Typography variant="caption" color="textSecondary">
              Status: {offer.status}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
