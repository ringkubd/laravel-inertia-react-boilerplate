import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head} from "@inertiajs/inertia-react";
import {Card, Table} from "flowbite-react";
import Form from "@/Pages/Security/Roles/Partials/Form";
import CardHeader from "@/Components/CardHeader";

export default function Roles(props){
    return (
        <Authenticated
            auth={props.auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Role</h2>}
        >
            <Head>
                <title>Edit Role</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Card className="overflow-x-auto">
                            <CardHeader back={route('roles.index')} />
                            <Form update={true} role={props.role} />
                        </Card>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
