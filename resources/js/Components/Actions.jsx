import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import {Link} from "@inertiajs/inertia-react";
export default function Actions(props){
    const {update, destroy,view, style, children, can, ...rest} = props
    return (
        <div className={style+" p-4 bg-gray-50 rounded-lg min-h-8 shadow-sm flex flex-row justify-center max-w-fit"} {...rest}>
            {
                update && can.update && <Link className="mx-2" href={update}><PrimaryButton className="bg-green-500">Edit</PrimaryButton></Link>
            }
            {
                view && can.view && <Link href={view} className="mx-2"><PrimaryButton className="bg-gray-500">Show</PrimaryButton></Link>
            }
            {
                destroy && can.delete && <Link className="mx-2" method="DELETE" href={destroy}><PrimaryButton className="bg-red-500">Delete</PrimaryButton></Link>
            }
            {children}
        </div>
    )
}
Actions.defaultProps = {
    style: "",
    update: false,
    destroy: false,
    view: false,
    can: {
        create: false,
        update: false,
        delete: false,
        view: false
    }
}
