'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import SaveButton from '@/components/saveButton';

interface BannerFormData {
    name: string;
    link: string;
    enable: boolean;
    file: File | null;
}

const BannerUpload = () => {
    const [formData, setFormData] = useState<BannerFormData>({
        name: '',
        link: '',
        enable: true,
        file: null,
    });
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('link', formData.link);
            formDataToSend.append('enable', formData.enable.toString());
            if (formData.file) {
                formDataToSend.append('file', formData.file);
            }
            const response = await fetch('https://pubshot-api.artixmiz.dev/Banner', {
                method: 'POST',
                body: formDataToSend,
            });
            console.log('response', response);

            console.log('Form Data Contents:');
            console.log('Name:', formDataToSend.get('name'));
            console.log('Link:', formDataToSend.get('link'));
            console.log('Enable:', formDataToSend.get('enable'));
            console.log('File:', formDataToSend.get('file'));

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            setSuccess(true);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload banner');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            link: '',
            enable: true,
            file: null,
        });
        setPreview('');
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Upload Banner</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter banner name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Link</label>
                        <Input
                            value={formData.link}
                            onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                            placeholder="Enter banner link"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Enable Banner</label>
                        <Switch
                            checked={formData.enable}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable: checked }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Banner Image</label>
                        <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer">
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                {preview ? (
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-h-48 mx-auto rounded-lg"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Click to upload banner image</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>Banner uploaded successfully!</AlertDescription>
                        </Alert>
                    )}

                    {/* <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !formData.file}
                    >
                        {loading ? 'Uploading...' : 'Upload Banner'}
                    </Button> */}
                    <div>
                        {/* Custom className passed to SaveButton */}
                        <SaveButton
                            onClick={() => console.log('Save clicked')}
                            disabled={false}
                            className="border-2 border-red-500 text-lg"
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default BannerUpload;