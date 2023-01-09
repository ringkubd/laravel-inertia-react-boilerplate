import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head} from "@inertiajs/inertia-react";
import {Card, Table} from "flowbite-react";
import CardHeader from "@/Components/CardHeader";
import Actions from "@/Components/Actions";

export default function Roles(props){
    return (
        <Authenticated
            auth={props.auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Roles Management</h2>}
        >
            <Head>
                <title>Roles Management</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Card className="overflow-x-auto">
                            <CardHeader
                                add_new={route('roles.create')}
                                can={props.can} />
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>SL#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>User's</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {
                                        props.roles.data.map((role, index) => {
                                            return (
                                                <tr key={index} data-testid="table-row-element">
                                                    <Table.Cell>{index+1}</Table.Cell>
                                                    <Table.Cell>{role.name}</Table.Cell>
                                                    <Table.Cell>{role.users.length}</Table.Cell>
                                                    <Table.Cell>
                                                        <Actions
                                                            can={props.can}
                                                            update={route('roles.edit', role.id)}
                                                            view={route('roles.show', role.id)}
                                                            destroy={route('roles.destroy', role.id)}
                                                        />
                                                    </Table.Cell>
                                                </tr>
                                            )
                                        })
                                    }
                                </Table.Body>
                            </Table>
                        </Card>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
