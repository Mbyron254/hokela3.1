import { gql } from '@apollo/client';

export const M_MAKE_JANTA_OFFERS = gql`
  mutation makeJantaOffers($input: InputJantaOfferMake!) {
    makeJantaOffers(input: $input) {
      message
    }
  }
`;

export const M_RECALL_JANTA_OFFERS = gql`
  mutation recallJantaOffers($input: InputJantaOfferRecall!) {
    recallJantaOffers(input: $input) {
      message
    }
  }
`;

export const M_REINSTATE_JANTA_OFFERS = gql`
  mutation reinstateJantaOffers($input: InputJantaOfferReinstate!) {
    reinstateJantaOffers(input: $input) {
      message
    }
  }
`;

export const M_RUN_OFFERS = gql`
  mutation runOffers($input: InputRunOffers!) {
    runOffers(input: $input) {
      count
      rows {
        index
        id
        created
        agent {
          user {
            name
            profile {
              photo {
                fileName
              }
            }
          }
        }
        run {
          id
          name
          code
          campaign {
            project {
              clientTier2 {
                name
                clientTier1 {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const M_RUN_OFFERS_RECYCLED = gql`
  mutation runOffersRecycled($input: InputRunOffers!) {
    runOffersRecycled(input: $input) {
      count
      rows {
        index
        id
        created
        recycled
        agent {
          user {
            name
            profile {
              photo {
                fileName
              }
            }
          }
        }
        run {
          id
          name
          code
          campaign {
            project {
              clientTier2 {
                name
                clientTier1 {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const M_RUN_OFFERS_SEARCH = gql`
  mutation searchRunOffers($input: InputRunOffersSearch!) {
    searchRunOffers(input: $input) {
      count
      rows {
        id
        agent {
          id
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
      }
    }
  }
`;

export const M_RUN_OFFER = gql`
  mutation runOffer($input: InputId!) {
    runOffer(input: $input) {
      id
      agent {
        id
        user {
          name
          email
          phone
          profile {
            photo {
              fileName
            }
          }
        }
      }
    }
  }
`;

// export const M_JANTA = gql`
//   mutation janta($input: InputId!) {
//     janta(input: $input) {
//       id
//       created
//       agent {
//         user {
//           id
//           name
//           profile {
//             photo {
//               fileName
//             }
//           }
//         }
//       }
//       run {
//         id
//         name
//         code
//         dateStart
//         dateStop
//         clockInTime
//         clockOutTime
//         campaign {
//           project {
//             clientTier2 {
//               clientTier1 {
//                 name
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export const M_CAMPAIGN_AGENTS = gql`
  mutation runOffers($input: InputRunOffers!) {
    runOffers(input: $input) {
      count
      rows {
        index
        type
        agent {
          id
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
        team {
          leader {
            id
            # user {
            #   id
            # }
          }
        }
      }
    }
  }
`;

export const M_JANTAS = gql`
  mutation jantas($input: InputRunOffers!) {
    jantas(input: $input) {
      count
      rows {
        index
        id
        created
        agent {
          user {
            name
            profile {
              photo {
                fileName
              }
            }
          }
        }
        run {
          id
          name
          clockType
          clockInPhotoLabel
          clockOutPhotoLabel
          poster {
            fileName
          }
          campaign {
            project {
              clientTier2 {
                name
                clientTier1 {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const M_JANTA = gql`
  mutation janta($input: InputId!) {
    janta(input: $input) {
      id
      created
      agent {
        user {
          id
          name
          profile {
            photo {
              fileName
            }
          }
        }
      }
      run {
        id
        name
        dateStart
        dateStop
        clockInTime
        clockOutTime
        clockInPhotoLabel
        clockOutPhotoLabel
        campaign {
          project {
            clientTier2 {
              clientTier1 {
                name
              }
            }
          }
        }
        types {
          id
          name
        }
      }
    }
  }
`;
