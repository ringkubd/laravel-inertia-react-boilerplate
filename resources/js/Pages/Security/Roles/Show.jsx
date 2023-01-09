import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head, Link} from "@inertiajs/inertia-react";
import {Button, Card, Label, Select, Spinner, Table} from "flowbite-react";
import CardHeader from "@/Components/CardHeader";
import Actions from "@/Components/Actions";
import * as Yup from 'yup';
import {ErrorMessage, Formik} from "formik";
import {Inertia} from "@inertiajs/inertia";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Show(props){
    const {role} = props;
    const data = role.data;

    const initValue = {
        user_id: ''
    }

    const validationSchema = Yup.object().shape({
        user_id: Yup.number().required('User is required')
    })
    const submitInvoke = (values, {setSubmitting, setErrors}) => {
        Inertia.post(route('roles.invoke', {role: data.id, user: values.user_id}), {}, {
            onError: (errors) => {setErrors(errors); setSubmitting(false)},
            onSuccess: params => { setSubmitting(false)},
        })
    }
    return (
        <Authenticated
            auth={props.auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Roles Management</h2>}
            flash={props.flash}
        >
            <Head>
                <title>Roles Management</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Card className="overflow-x-auto">
                            <CardHeader
                                back={route('roles.index')}
                                can={props.can} />
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>User's</Table.HeadCell>
                                    <Table.HeadCell>Permission's</Table.HeadCell>
                                    <Table.HeadCell>Actions</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    <tr data-testid="table-row-element">
                                        <Table.Cell>{data.name}</Table.Cell>
                                        <Table.Cell>{data.users?.length}</Table.Cell>
                                        <Table.Cell>{data.permissions?.length}</Table.Cell>
                                        <Table.Cell>
                                            <Actions
                                                can={props.can}
                                                update={route('roles.edit', data.id)}
                                                destroy={route('roles.destroy', data.id)}
                                            >
                                                <Link className="mx-2"  href={route('role.permission', data.id)}><PrimaryButton className="bg-sky-500 hover:bg-sky-600">Permissions</PrimaryButton></Link>
                                            </Actions>
                                        </Table.Cell>
                                    </tr>
                                </Table.Body>
                            </Table>
                            {
                                props.users.length > 0 && (
                                    <div className="flex flex-col sm:flex-row max-w-4xl">
                                        <Formik initialValues={initValue} onSubmit={submitInvoke} validationSchema={validationSchema} >
                                            {
                                                ({values, handleChange, handleSubmit, handleBlur, errors, isSubmitting, isValidating}) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="flex flex-col sm:flex-row justify-between w-[100%]">
                                                            <Label className="m-2" htmlFor="user_id">User</Label>
                                                            <Select
                                                                name="user_id"
                                                                id="user_id"
                                                                onChange={handleChange}
                                                                helperText={errors.user_id && <span className="text-red-500"><span className="font-medium">Whoops!</span>{' '}{errors.user_id}!</span>}
                                                                className="rounded border-blue-500 active:border-blue-800 m-2 flex">
                                                                <option value=""></option>
                                                                {
                                                                    props.users.map((u, i) => {
                                                                        return (
                                                                            <option key={i} value={u.id}>{u.name}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>

                                                            <Button gradientDuoTone="purpleToBlue" type="submit" className="my-2" disabled={isSubmitting}>
                                                                {
                                                                    isSubmitting && (
                                                                        <div className="mr-3">
                                                                            <Spinner
                                                                                size="sm"
                                                                                light={true}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                                Invoke
                                                            </Button>
                                                        </div>

                                                    </form>
                                                )
                                            }
                                        </Formik>
                                    </div>
                                )
                            }

                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>SL#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Action</Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {
                                        data.users?.map((u, index) => {
                                            return (
                                                <tr key={index} data-testid="table-row-element">
                                                    <Table.Cell>{index + 1}</Table.Cell>
                                                    <Table.Cell>{u.name}</Table.Cell>
                                                    <Table.Cell>
                                                        <Link className="inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest bg-green-500 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 undefined hover:bg-green-500" method="post" as="button" href={route('roles.revoke', {role: data.id, user: u.id})}>
                                                            Revoke
                                                        </Link>
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
