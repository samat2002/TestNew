
"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Types
interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface UserFormData {
    name: string;
    email: string;
    phone: string;
}

const UserCRUD = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            setUsers(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoading(false);
        }
    };

    // Create user
    const createUser = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            setUsers([...users, { ...data, id: users.length + 1 }]);
            resetForm();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    // Update user
    const updateUser = async () => {
        if (!selectedUser) return;
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${selectedUser.id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            setUsers(users.map(user =>
                user.id === selectedUser.id ? { ...data, id: selectedUser.id } : user
            ));
            resetForm();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Delete user
    const deleteUser = async (id: number) => {
        try {
            await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
                method: 'DELETE',
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode) {
            updateUser();
        } else {
            createUser();
        }
        setIsDialogOpen(false);
    };

    const handleEdit = (user: User) => {
        console.log('user', user);

        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
        setIsEditMode(true);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '' });
        setSelectedUser(null);
        setIsEditMode(false);
    };

    const handleDialogClose = () => {
        resetForm();
        setIsDialogOpen(false);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { setIsEditMode(false); resetForm(); }}>
                                Add New User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full"
                                />
                                <Input
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full"
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {isEditMode ? 'Update' : 'Create'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(user)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => deleteUser(user.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export default UserCRUD;