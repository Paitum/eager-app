import { useState, useDebugValue, useEffect, useRef, useLayoutEffect } from 'react';
import { useForceUpdate } from 'observable-hooks';

/**
 * Optimized for safely getting synchronous values from hot or pure observables
 * without triggering extra initial re-rendering.
 *
 * ⚠ If the observable is cold and with side effects
 * they will be performed at least twice!
 *
 * By default this hook will subscribe to the observable at least twice.
 * The first time is for getting synchronous value to prevent extra initial re-rendering.
 * In concurrent mode this may happen more than one time.
 *
 * @template TState State.
 *
 * @param state$ An observable of state value.
 */
export function useObservableEagerState(state$) {
    var forceUpdate = useForceUpdate();
    var state$Ref = useRef(state$);
    var errorRef = useRef();
    var isAsyncEmissionRef = useRef(false);
    var didSyncEmit = useRef(false);
    var _a = useState(function () {
        var state;
        state$
            .subscribe({
                next: function (value) {
                    console.log(`observable-hooks:uOES: useState value[${value}] didSyncEmit[${didSyncEmit.current}]`);
                    didSyncEmit.current = true;
                    state = value;
                },
                error: function (error) {
                    console.log(`observable-hooks:uOES: useState error`, error);
                    errorRef.current = error;
                }
            })
            .unsubscribe();
        return state;
    }), state = _a[0], setState = _a[1];

    console.log(`observable-hooks:uOES: post useState state[${state}]`);

    // update the latest observable
    // synchronously after render being committed
    useIsomorphicLayoutEffect(function () {
        state$Ref.current = state$;
    });

    useEffect(function () {
        errorRef.current = null;
        // keep in closure for checking staleness
        var input$ = state$Ref.current;
if(state === 'Final Value') {
    console.log("*** HOW DID 'Final Value' get set into state? ***");
}
        console.log(`observable-hooks:uOES: useEffect start state[${state}]`);

        var subscription = input$.subscribe({
            next: function (value) {
                console.log(`observable-hooks:uOES: useEffect next: value[${value}] state[${state}] isAsyncEmissionRef[${isAsyncEmissionRef.current}] isStale[${input$ !== state$Ref.current}]`);

                if (input$ !== state$Ref.current) {
                    // stale observable
                    return;
                }
                if (isAsyncEmissionRef.current) {
                    // ignore synchronous value
                    // prevent initial re-rendering
                    console.log(`observable-hooks:uOES: useEffect next: value[${value}] old-state[${state}]`);
                    setState(value);
                }
            },
            error: function (error) {
                console.log(`observable-hooks:uOES: useEffect error:  error`, error);
                if (input$ !== state$Ref.current) {
                    // stale observable
                    return;
                }
                errorRef.current = error;
                forceUpdate();
            }
        });
        isAsyncEmissionRef.current = true;
        console.log(`observable-hooks:uOES: useEffect end state[${state}]`);
        return function () {
            subscription.unsubscribe();
        };
    }, [state$, forceUpdate, setState, state]); // added deps to quiet webpack warning
    if (errorRef.current) {
        // Let error boundary catch the error
        throw errorRef.current;
    }
    if (didSyncEmit.current) {
        console.log(`observable-hooks:uOES: return state[${state}]`);
        useDebugValue(state);
        return state;
    } else {
        throw new Error('Observable did not synchronously emit a value.');
    }
}

/**
 * Prevent React warning when using useLayoutEffect on server.
 */
export const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
        ? useLayoutEffect
        : /* istanbul ignore next: both are not called on server */
        useEffect
