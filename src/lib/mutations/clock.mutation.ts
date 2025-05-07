import { gql } from '@apollo/client';

export const CLOCK_IN_OUT = gql`
  mutation clockInOut($input: InputClockInOut!) {
    clockInOut(input: $input) {
      message
    }
  }
`;

export const CLOCKS_LOGS = gql`
  mutation clockLogs($input: InputClocks!) {
    clockLogs(input: $input) {
      count
      rows {
        index
        id
        clockInAt
        clockOutAt
        agent {
          user {
            name
            email
            profile {
              photo {
                fileName
              }
            }
          }
        }
        clockPhoto {
          fileName
        }
        run {
          clockType
          clockInPhotoLabel
          clockOutPhotoLabel
        }
        # point {
        #   id
        # }
        # direction {
        #   id
        # }
        # area {
        #   id
        # }
        # clockMode
        # lat
        # lng
        # created
      }
    }
  }
`;

export const AGENTS_LATEST_CLOCK = gql`
  mutation agentsLatestClocks($input: InputClocks!) {
    agentsLatestClocks(input: $input) {
      index
      id
      clockInAt
      clockOutAt
      lat
      lng
      agent {
        user {
          name
          email
          profile {
            photo {
              fileName
            }
          }
        }
      }
      clockPhoto {
        fileName
      }
      run {
        clockType
        clockInPhotoLabel
        clockOutPhotoLabel
      }
      # point {
      #   id
      # }
      # direction {
      #   id
      # }
      # area {
      #   id
      # }
      # clockMode
      # lat
      # lng
      # created
    }
  }
`;
