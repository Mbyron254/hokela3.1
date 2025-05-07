import { gql } from '@apollo/client';

export const M_DASHBOARD_AGENCY_ENTITIES = gql`
  query dashboardAgencyEntities {
    dashboardAgencyEntities {
      clients {
        total
        percentageGrowth
      }
      projects {
        total
        percentageGrowth
      }
      campaigns {
        total
        percentageGrowth
      }
      users {
        total
        percentageGrowth
      }
    }
  }
`;
