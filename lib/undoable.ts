export const UNDO = "__UNDO__" as const;
export const LOAD = "__LOAD__" as const;
export type UndoActionType = typeof UNDO;
export type LoadActionType = typeof LOAD;

type SomeAction = { type: string };
type UndoAction = { type: UndoActionType };
type LoadAction<A> = { type: LoadActionType; record: readonly A[] };
type UndoableState<S, A> = { state: S; record: readonly A[]; snapshots: S[] };
type UndoableAction<A extends SomeAction> = A | UndoAction | LoadAction<A>;

const isUndoAction = (action: SomeAction): action is UndoAction =>
  action.type === UNDO;

const isLoadAction = <A>(action: SomeAction): action is LoadAction<A> =>
  action.type === LOAD;

export function undoableInit<S, A>(
  init: () => S,
  reducer: (s: S, a: A) => S
): (record: readonly A[]) => UndoableState<S, A> {
  return (record: readonly A[]) => {
    let state = init();
    const snapshot = state;
    record.forEach((replayAction) => {
      state = reducer(state, replayAction);
    });
    return {
      state,
      record,
      snapshots: [snapshot],
    };
  };
}

export function undoable<S, A extends SomeAction>(
  init: () => S,
  reducer: (s: S, a: A) => S
) {
  return (
    state: UndoableState<S, A>,
    action: UndoableAction<A>
  ): UndoableState<S, A> => {
    if (isLoadAction(action)) {
      return undoableInit(init, reducer)(action.record);
    } else if (isUndoAction(action)) {
      // Today's assumption: only one snapshot
      if (state.record.length === 0 || state.snapshots.length === 0) {
        return state;
      }
      const newRecord = state.record.slice(0, -1);
      let newState = state.snapshots[0];
      newRecord.forEach((replayAction) => {
        newState = reducer(newState, replayAction);
      });
      const newSnapshots = newRecord.length === 0 ? [] : state.snapshots;
      return {
        state: newState,
        record: newRecord,
        snapshots: newSnapshots,
      };
    } else {
      const act = action as A; // hack: type assertion
      const newState = reducer(state.state, act);
      if (state.snapshots.length === 0) {
        return {
          snapshots: [state.state],
          record: [],
          state: newState,
        };
      }
      const newRecord = [...state.record, act];

      return {
        state: newState,
        record: newRecord,
        snapshots: state.snapshots,
      };
    }
  };
}
