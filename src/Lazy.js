import './App.css';
import {useValue} from "./Service";

function Lazy() {
    const value = useValue();

    console.log(`Lazy Value '${value}'`);

    return (
        <>
            <div>The lazy value is [{value}]</div>
        </>
    );
}

export default Lazy;
