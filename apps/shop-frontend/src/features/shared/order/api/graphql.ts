import { gql } from '@apollo/client';

export const TRANSITION_ORDER_TO_STATE = gql`
  mutation TransitionOrderToState($state: String!) {
    transitionOrderToState(state: $state) {
      ... on OrderStateTransitionError {
        errorCode
        message
        transitionError
      }
    }
  }
`;
