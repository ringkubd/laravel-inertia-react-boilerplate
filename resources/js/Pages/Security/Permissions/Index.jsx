import React, {useEffect} from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head} from "@inertiajs/inertia-react";
import {Button, Card, Label, Pagination, Table, TextInput} from "flowbite-react";
import CardHeader from "@/Components/CardHeader";
import {pageChange} from "@/Utils/Common";
import {Formik} from "formik";
import Actions from "@/Components/Actions";
import * as Yup from 'yup';
import {Inertia} from "@inertiajs/inertia";

export default function Permissions(props){
    const initValues = {
        name: ''
    };
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required.')
    })
    const submit = (values, {setErrors, setSubmitting}) => {
        Inertia.post(route('permissions.store'), values, {
            onError: error => setErrors(error)
        })
    }
    return (
        <Authenticated
            auth={props.auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Permissions Management</h2>}
            flash={props.flash}
        >
            <Head>
                <title>Permissions Management</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Card className="overflow-x-auto">
                            <CardHeader can={props.can}>
                                <div>
                                    <Formik initialValues={initValues} onSubmit={submit} validationSchema={validationSchema}>
                                        {
                                            ({values, handleSubmit, handleChange, errors}) => (
                                                <form onSubmit={handleSubmit}>
                                                    <div className="flex flex-row">
                                                        <div className="flex flex-row items-center">
                                                            <Label value="Name" htmlFor="name" className="mx-2 my-2 sm:my-0">Name</Label>
                                                            <TextInput
                                                                name="name"
                                                                onChange={handleChange}
                                                                helperText={errors.name && <span className="text-red-500 my-2"><span className="font-medium">Oops!</span>{' '}{errors.name}</span>}
                                                            />
                                                        </div>
                                                        <div className="flex flex-row items-center mx-2 my-2 sm:my-0">
                                                            <Button type="submit">Add</Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            )
                                        }
                                    </Formik>
                                </div>
                            </CardHeader>
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>SL#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>User's</Table.HeadCell>
                                    <Table.HeadCell>Role's</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {
                                        props.permissions.data.map((permission, index) => {
                                            return (
                                                <tr key={index} data-testid="table-row-element">
                                                    <Table.Cell>{index+1}</Table.Cell>
                                                    <Table.Cell>{permission.name}</Table.Cell>
                                                    <Table.Cell>{permission.users.length}</Table.Cell>
                                                    <Table.Cell>{permission.roles.length}</Table.Cell>
                                                    <Table.Cell>
                                                        <Actions
                                                            can={props.can}
                                                            destroy={route('permissions.destroy', permission.id)}
                                                        />
                                                    </Table.Cell>
                                                </tr>
                                            )
                                        })
                                    }
                                </Table.Body>
                            </Table>
                            <Pagination
                                currentPage={props.permissions.meta.current_page}
                                totalPages={Math.ceil(props.permissions.meta.total / props.permissions.meta.per_page)}
                                onPageChange={(pageNo) => pageChange(pageNo, props.permissions.meta)}
                                showIcons={true}
                                layout="pagination"
                            />
                        </Card>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
