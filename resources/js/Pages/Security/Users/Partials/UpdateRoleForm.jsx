import React, {useState} from "react";
import {Formik} from "formik";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import {Transition} from "@headlessui/react";
import {Inertia} from "@inertiajs/inertia";

const animatedComponents = makeAnimated();
export default function UpdateRoleForm({roles, user, className}){
    const [isSuccessFull, setIsSuccessFull] = useState(false)
    const initValues = {
        roles: user.roles.map((r) => {
            return {label: r.name, value: r.id}
        })
    };
    const submit = (values) => {
        Inertia.put(route('users.update_role', user.id), values, {
            onSuccess: (s) => setIsSuccessFull(true),
            preserveState: true
        })
    }
    const options = () => {
        return roles.map((role) => {
            return {value: role.id, label: role.name}
        })
    }
    const abc = options()
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Update Role</h2>

                <p className="mt-1 text-sm text-gray-600">
                    You can add multiple role.
                </p>
            </header>
            <div className="py-12">
                <Formik initialValues={initValues} onSubmit={submit}>
                    {
                        ({handleSubmit, values, handleChange, setValues, errors, isSubmitting}) => (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                <div>
                                    <label htmlFor="role">
                                        <Select
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            isMulti
                                            options={abc}
                                            defaultValue={values.roles}
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full"
                                            onChange={(selected) => {
                                                const roles = selected.map(s => s.value.toString())
                                                setValues({
                                                    roles
                                                })
                                                console.log(values)
                                            }}
                                        />
                                    </label>
                                    <InputError message={errors.roles} className="mt-2" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <PrimaryButton processing={isSubmitting}>Save</PrimaryButton>

                                    <Transition
                                        show={isSuccessFull}
                                        enterFrom="opacity-0"
                                        leaveTo="opacity-0"
                                        className="transition ease-in-out"
                                    >
                                        <p className="text-sm text-gray-600">Saved.</p>
                                    </Transition>
                                </div>
                            </form>
                        )
                    }
                </Formik>
            </div>
        </section>
    )
}
