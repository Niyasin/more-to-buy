import L from './styles/Loading.module.css';
const Loading=()=>{


    return(
        <div className={L.container}>
            <div className={L.box}></div>
            <div className={L.box}></div>
            <div className={L.box}></div>   
        </div>
    );
}
export default Loading;