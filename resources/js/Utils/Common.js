import {Inertia} from "@inertiajs/inertia";

const pageChange = (pageNo, {path}) => {
    const url = path +"?page="+pageNo
    Inertia.get(url)
}

export {
    pageChange
}
