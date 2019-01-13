import accessToken from "./accessToken";
import { LOGIN, LOGOUT } from "../actionTypes";

describe('accessToken', () => {
  it('returns state for unknown action', () => {
    expect(
      accessToken(
        'some-token',
        { type: 'FOO_BAR_BAZ' }
      )
    ).toEqual('some-token');
  });

  describe('LOGIN', () => {
    describe('with default state', () => {
      it('sets access token', () => {
        expect(
          accessToken(
            undefined,
            {
              type: LOGIN,
              payload: {
                accessToken: 'my-access-token-123'
              }
            }
          )
        ).toEqual('my-access-token-123');
      });
    });

    describe('with empty state', () => {
      it('sets access token', () => {
        expect(
          accessToken(
            '',
            {
              type: LOGIN,
              payload: {
                accessToken: 'my-access-token-123'
              }
            }
          )
        ).toEqual('my-access-token-123');
      });
    });

    describe('with existing access token', () => {
      it('sets access token', () => {
        expect(
          accessToken(
            'old-token-from-before',
            {
              type: LOGIN,
              payload: {
                accessToken: 'my-access-token-123'
              }
            }
          )
        ).toEqual('my-access-token-123');
      });
    });
  });

  describe('LOGOUT', () => {
    describe('with default state', () => {
      it('keeps default state', () => {
        expect(
          accessToken(
            undefined,
            { type: LOGOUT }
          )
        ).toEqual(null);
      });
    });

    describe('with empty state', () => {
      it('clears access token', () => {
        expect(
          accessToken(
            '',
            { type: LOGOUT }
          )
        ).toEqual(null);
      });
    });

    describe('with existing access token', () => {
      it('clears access token', () => {
        expect(
          accessToken(
            'existing-access-token',
            { type: LOGOUT }
          )
        ).toEqual(null);
      });
    });
  });
});
