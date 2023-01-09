import React, {useEffect, useRef} from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {Head} from "@inertiajs/inertia-react";
import {Card, Checkbox, Label, Table, TextInput} from "flowbite-react";
import CardHeader from "@/Components/CardHeader";
import {Field, Formik} from "formik";
import {Inertia} from "@inertiajs/inertia";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace('_', " ");
}
function splitConcat(string){
    const str = string.split("_");
    return str[0]
}

Array.prototype.unique = function(a){
    return function(){ return this.filter(a) }
}(function(a,b,c){ return c.indexOf(a,b+1) < 0 });
export default function RolePermissions(props){
    const {permissions, flash, auth, existing_permissions, role} = props
    const oldPermissions = existing_permissions ? existing_permissions.map(item => (item.toString())) : [];
    const initValue = {
        permissions: oldPermissions,
        modules: []
    }
    function submit(values){
        Inertia.post(route('role.permission.update', role.id), values)
    }

    return (
        <Authenticated
            flash={flash}
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Permissions Management</h2>}
        >
            <Head>
                <title>Role Permission Management</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Card>
                            <CardHeader back={route('roles.show', role.id)} can={props.can} />
                            <Formik initialValues={initValue} onSubmit={submit} >
                                {
                                    ({handleChange, handleSubmit, values, setValues, setFormikState, handleBlur}) => (
                                        <form onSubmit={handleSubmit}>
                                            <Table className="p-4 m-6">
                                                <Table.Head>
                                                    <Table.HeadCell>Module</Table.HeadCell>
                                                    <Table.HeadCell>All</Table.HeadCell>
                                                    <Table.HeadCell>Create</Table.HeadCell>
                                                    <Table.HeadCell>Delete</Table.HeadCell>
                                                    <Table.HeadCell>Update</Table.HeadCell>
                                                    <Table.HeadCell>View</Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {
                                                        Object.keys(permissions).map((module, i) => (
                                                            <tr data-testid="table-row-element" key={i}>
                                                                <th>{capitalizeFirstLetter(module)}</th>
                                                                <td>
                                                                    <Checkbox
                                                                        className="h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 mr-2 check-input"
                                                                        type="checkbox"
                                                                        onChange={(ev) => {
                                                                            const md = ev.target.value;
                                                                            if(ev.target.checked){
                                                                                permissions[md].map((p) => {
                                                                                    values.permissions.push(p.id.toString())
                                                                                })
                                                                                values.modules.push(md)
                                                                                setValues({
                                                                                    permissions: values.permissions.unique(),
                                                                                    modules: values.modules
                                                                                })
                                                                            }else{
                                                                                permissions[md].forEach((p) => {
                                                                                    if (values.permissions.indexOf(p.id.toString()) !== -1){
                                                                                        values.permissions.splice(values.permissions.indexOf(p.id.toString()), 1)
                                                                                    }
                                                                                });
                                                                                values.modules.splice(values.modules.indexOf(md));
                                                                                setValues({
                                                                                    permissions: values.permissions.unique(),
                                                                                    modules: values.modules
                                                                                })
                                                                            }
                                                                            // handleSubmit(ev);
                                                                        }}
                                                                        onBlur={handleSubmit}
                                                                        checked={values.modules.indexOf(module) !== -1}
                                                                        name="modules"
                                                                        value={module}
                                                                    />
                                                                </td>
                                                                {
                                                                    permissions[module].map((permission, i ) => (
                                                                        <td key={i} className="p-4">
                                                                            <Label>
                                                                                <Field
                                                                                    type="checkbox"
                                                                                    name="permissions"
                                                                                    value={permission.id.toString()}
                                                                                    className="h-4 w-4 rounded border border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 mr-2 check-input"
                                                                                    onBlur={handleSubmit}
                                                                                    onChange={(ev) => {
                                                                                        const v = ev.target.value;
                                                                                        if (!ev.target.checked){
                                                                                            values.modules.splice(values.modules.indexOf(module), 1)
                                                                                        }
                                                                                        setValues({
                                                                                            permissions: values.permissions.unique(),
                                                                                            modules: values.modules
                                                                                        })
                                                                                        handleChange(ev)
                                                                                        // handleSubmit(ev)
                                                                                    }}
                                                                                />
                                                                                {capitalizeFirstLetter(splitConcat(permission.name))}
                                                                            </Label>
                                                                        </td>
                                                                    ))
                                                                }
                                                            </tr>
                                                        ))
                                                    }

                                                </Table.Body>
                                            </Table>
                                            <div className="flex flex-1 justify-end mt-5">
                                                <input type="submit" value="Submit" className="py-3 px-5 bg-green-400 rounded ring-2 ring-yellow-600 mt-2 hover:bg-green-500 active:bg-green-800 hover:cursor-pointer"/>
                                            </div>
                                        </form>
                                    )
                                }

                            </Formik>
                        </Card>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
