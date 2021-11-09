import './App.css';
import {serviceInstance, useValue} from "./Service";
import {useEffect} from "react";

function App() {
    const value = useValue();
    serviceInstance.fetchData();

    useEffect(() => {
        console.log(`App Value '${value}'`);
    }, [value]);

    return (
        <>
            <h1>The value is {value}</h1>
        </>
    );
}

export default App;


// import {lazy, Suspense} from "react";
// const Lazy = lazy(() => import('./Lazy'));
//
// function App() {
//     const value = useValue();
//     serviceInstance.fetchData();
//
//     useEffect(() => {
//         console.log(`App Value '${value}'`);
//     }, [value]);
//
//     return (
//         <>
//             <h1>The value is {value}</h1>
//             <Suspense fallback={<div>Loading</div>}>
//                 <Lazy/>
//             </Suspense>
//         </>
//     );
// }
//
// export default App;
