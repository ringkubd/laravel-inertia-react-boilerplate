import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import {Link} from "@inertiajs/inertia-react";
export default function CardHeader(props){
    const {add_new, back, style, search, children, can, ...rest} = props
    return (
        <div className={style+" p-4 bg-gray-50 rounded-lg min-h-8 shadow-md flex flex-row justify-between"} {...rest}>
            {
                add_new && can.create && <Link href={add_new}><PrimaryButton className="bg-cyan-500 hover:bg-cyan-600 active:bg-green-400">Add New</PrimaryButton></Link>
            }
            {
                back && <Link href={back}><PrimaryButton className="bg-cyan-500 hover:bg-cyan-600 active:bg-green-400">Back</PrimaryButton></Link>
            }
            {children}
        </div>
    )
}
CardHeader.defaultProps = {
    style: "",
    add_new: false,
    back: false,
    search: false,
    can: {
        create: false,
        update: false,
        delete: false,
        view: false
    }
}
