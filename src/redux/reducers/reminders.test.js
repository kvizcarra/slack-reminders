import reminders from "./reminders";
import {
  LOGOUT,
  LOAD_REMINDERS,
  ADD_REMINDER,
  DELETE_REMINDER,
  COMPLETE_REMINDER
} from "../actionTypes";
import { PAST, COMPLETE, UPCOMING, RECURRING } from "../../reminderTypes";

describe('reminders', () => {
  it('returns state for unknown action', () => {
    expect(
      reminders(
        ['some', 'reminders', 'foo'],
        { type: 'FOO_BAR_BAZ' }
      )
    ).toEqual(['some', 'reminders', 'foo']);
  });

  describe('LOGOUT', () => {
    describe('with default state', () => {
      it('keeps default state', () => {
        expect(
          reminders(
            undefined,
            { type: LOGOUT }
          )
        ).toEqual([]);
      });
    });

    describe('with one reminder', () => {
      it('clears reminder', () => {
        expect(
          reminders(
            ['one'],
            { type: LOGOUT }
          )
        ).toEqual([]);
      });
    });

    describe('with multiple reminders', () => {
      it('clears all reminders', () => {
        expect(
          reminders(
            ['one', 'two', 'three'],
            { type: LOGOUT }
          )
        ).toEqual([]);
      });
    });
  });

  describe('LOAD_REMINDERS', () => {
    describe('with default state', () => {
      it('loads new reminders', () => {
        expect(
          reminders(
            undefined,
            {
              type: LOAD_REMINDERS,
              payload: {
                reminders: ['newone', 'newtwo', 'newthree']
              }
            }
          )
        ).toEqual(['newone', 'newtwo', 'newthree']);
      });
    });

    describe('with one existing reminder', () => {
      it('loads only new reminders', () => {
        expect(
          reminders(
            ['oldone'],
            {
              type: LOAD_REMINDERS,
              payload: {
                reminders: ['newone', 'newtwo', 'newthree']
              }
            }
          )
        ).toEqual(['newone', 'newtwo', 'newthree']);
      });
    });

    describe('with multiple existing reminders', () => {
      it('loads only new reminders', () => {
        expect(
          reminders(
            ['oldone', 'oldtwo', 'oldthree'],
            {
              type: LOAD_REMINDERS,
              payload: {
                reminders: ['newone', 'newtwo', 'newthree']
              }
            }
          )
        ).toEqual(['newone', 'newtwo', 'newthree']);
      });
    });
  });

  describe('ADD_REMINDER', () => {
    describe('with default state', () => {
      it('appends new reminder', () => {
        expect(
          reminders(
            undefined,
            {
              type: ADD_REMINDER,
              payload: {
                reminder: 'newone'
              }
            }
          )
        ).toEqual(['newone']);
      });
    });

    describe('with one existing reminder', () => {
      it('appends new reminder', () => {
        expect(
          reminders(
            ['oldone'],
            {
              type: ADD_REMINDER,
              payload: {
                reminder: 'newone'
              }
            }
          )
        ).toEqual(['oldone', 'newone']);
      });
    });

    describe('with multiple existing reminders', () => {
      it('appends new reminder', () => {
        expect(
          reminders(
            ['oldone', 'oldtwo', 'oldthree'],
            {
              type: ADD_REMINDER,
              payload: {
                reminder: 'newone'
              }
            }
          )
        ).toEqual(['oldone', 'oldtwo', 'oldthree', 'newone']);
      });
    });
  });

  describe('COMPLETE_REMINDER', () => {
    beforeAll(() => {
      // Mock Date.now
      Date.now = jest.fn(() => 1547961510); // 2019-01-19 9:19:30 PM PST
    });

    describe('with default state', () => {
      it('keeps default state', () => {
        expect(
          reminders(
            undefined,
            {
              type: COMPLETE_REMINDER,
              payload: {
                reminderId: 'one1'
              }
            }
          )
        ).toEqual([]);
      });
    });

    describe('with one existing reminder', () => {
      it('completes reminder', () => {
        expect(
          reminders(
            [
              { id: 'one1', reminderType: PAST }
            ],
            {
              type: COMPLETE_REMINDER,
              payload: {
                reminderId: 'one1'
              }
            }
          )
        ).toEqual([
          { id: 'one1', reminderType: COMPLETE, complete_ts: 1547961510 }
        ]);
      });
    });

    describe('with multiple existing reminders', () => {
      it('completes reminder', () => {
        expect(
          reminders(
            [
              { id: 'one1', reminderType: UPCOMING },
              { id: 'two2', reminderType: PAST },
              { id: 'three3', reminderType: RECURRING },
              { id: 'four4', reminderType: COMPLETE, complete_ts: 5 }
            ],
            {
              type: COMPLETE_REMINDER,
              payload: {
                reminderId: 'one1'
              }
            }
          )
        ).toEqual([
          { id: 'one1', reminderType: COMPLETE, complete_ts: 1547961510 },
          { id: 'two2', reminderType: PAST },
          { id: 'three3', reminderType: RECURRING },
          { id: 'four4', reminderType: COMPLETE, complete_ts: 5 }
        ]);
      });
    });
  });

  describe('DELETE_REMINDER', () => {
    describe('with default state', () => {
      it('keeps default state', () => {
        expect(
          reminders(
            undefined,
            {
              type: DELETE_REMINDER,
              payload: {
                reminderId: 'one1'
              }
            }
          )
        ).toEqual([]);
      });
    });

    describe('with one existing reminder', () => {
      it('deletes reminder', () => {
        expect(
          reminders(
            [
              { id: 'one1' }
            ],
            {
              type: DELETE_REMINDER,
              payload: {
                reminderId: 'one1'
              }
            }
          )
        ).toEqual([]);
      });
    });

    describe('with multiple existing reminders', () => {
      it('deletes reminder', () => {
        expect(
          reminders(
            [
              { id: 'one1' },
              { id: 'two2' },
              { id: 'three3' }
            ],
            {
              type: DELETE_REMINDER,
              payload: {
                reminderId: 'one1'
              }
            }
          )
        ).toEqual([
          { id: 'two2' },
          { id: 'three3' }
        ]);
      });
    });
  });
});
