import { toast } from 'react-toastify';
export function notify(msg, type){
    switch(type){
        case "success":
            toast.success(msg,{autoClose:2500});
            break;
        case "warn":
            toast.warn(msg,{autoClose:2500});
            break;
        case "error":
            toast.error(msg,{autoClose:2500});
            break;
        case "info":
            toast.info(msg,{autoClose:2500});
            break;
        default:
            // code block
    }
}