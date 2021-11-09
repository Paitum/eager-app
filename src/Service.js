import {BehaviorSubject} from "rxjs";
// import {useObservableEagerState} from "observable-hooks";
import {useObservableEagerState} from "./use-observable-eager-state";

export const serviceInstance = new Service();

export function Service() {
    const subject$ = new BehaviorSubject('Initial Value');
    const observable$ = subject$.asObservable();
    let needToFetch = true;

    return {
        fetchData,
        get value$() {
            // needToFetch && fetchData();
            return observable$;
        }
    }

    function fetchData() {
        if (needToFetch) {
            console.log('Service fetchData() <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
            needToFetch = false;
            subject$.next("Final Value");

            // setTimeout(() => {
            //     subject$.next("Final Value");
            // }, 0)
        }
    }
}

export function useValue() {
    return useObservableEagerState(serviceInstance.value$);
}
