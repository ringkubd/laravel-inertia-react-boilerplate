import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head, Link} from "@inertiajs/inertia-react";
import {Card, Table} from "flowbite-react";
import CardHeader from "@/Components/CardHeader";
import Actions from "@/Components/Actions";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Users(props){
    const {users, can} = props;
    return (
        <Authenticated
            flash={props.flash}
            auth={props.auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">User's Management</h2>}>
            <Head>
                <title>User's Management</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader
                                can={can}
                                add_new={route('users.create')}
                            />
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>SL#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Email</Table.HeadCell>
                                    <Table.HeadCell>Roles</Table.HeadCell>
                                    <Table.HeadCell>Permissions</Table.HeadCell>
                                    <Table.HeadCell>Action</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {
                                        users.data.map((user, index) => (
                                            <tr data-testid="table-row-element" key={index}>
                                                <Table.Cell>{index + 1}</Table.Cell>
                                                <Table.Cell>{user.name}</Table.Cell>
                                                <Table.Cell>{user.email}</Table.Cell>
                                                <Table.Cell>{user.role_name}</Table.Cell>
                                                <Table.Cell>{user.permissions.length}</Table.Cell>
                                                <Table.Cell>
                                                    <Actions
                                                        can={can}
                                                        update={route('users.edit', user.id)}
                                                        destroy={route('users.destroy', user.id)}
                                                    >
                                                        <Link className="mx-2" href={route('users.user_permission', user.id)}><PrimaryButton className="bg-blue-500">Permissions</PrimaryButton></Link>
                                                    </Actions>
                                                </Table.Cell>
                                            </tr>
                                        ))
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
