import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/inertia-react';
import UpdateRoleForm from "@/Pages/Security/Users/Partials/UpdateRoleForm";
import UpdateProfileInformation from "@/Pages/Security/Users/Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/Pages/Security/Users/Partials/UpdatePasswordForm";
import DeleteUserForm from "@/Pages/Security/Users/Partials/DeleteUserForm";

export default function Edit({ auth, mustVerifyEmail, status, roles, user }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Update user information</h2>}
        >
            <Head title="Update user information" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformation
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            user={user}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateRoleForm
                            roles={roles}
                            user={user}
                            className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm
                            user={user}
                            className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
