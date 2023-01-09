import React, {useEffect} from "react";
import {Formik} from "formik";
import {Label, TextInput} from "flowbite-react";
import PrimaryButton from "@/Components/PrimaryButton";
import * as Yup from 'yup';
import {Inertia} from "@inertiajs/inertia";

export default function Form(props){
    const initValues = {
        name: props.role?.name,
    }
    const submit = (values, {setErrors}) => {
        props.update ?
            Inertia.patch(route('roles.update', props.role.id), values, {
                onError: (errors) => setErrors(errors)
            })
            :
        Inertia.post(route('roles.store'), values, {
            onError: (errors) => setErrors(errors)
        })
    }
    const validation = Yup.object().shape({
        name: Yup.string().required('Role name is required.')
    })
    return (
        <Formik
            initialValues={initValues}
            onSubmit={submit}
            validationSchema={validation}
        >
            {
                ({values, errors, touched, handleChange, handleSubmit, handleReset, handleBlur}) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="mb-2 block">
                                <Label  htmlFor="name"
                                        value="Name" />
                            </div>
                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                className="my-2"
                                onChange={handleChange}
                                value={values.name}
                                helperText={errors.name && <span className="text-red-500 my-2"><span className="font-medium">Oops!</span>{' '}{errors.name}</span>}
                            />
                        </div>
                        <PrimaryButton className={props.update? 'bg-yellow-400': 'bg-green-400'} type="submit">
                            {
                                props.update ? 'Update' : 'Submit'
                            }
                        </PrimaryButton>
                    </form>
                )
            }
        </Formik>
    )
}
Form.defaultProps = {
    update: false
}
