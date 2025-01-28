import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import JobApi from '@/service/JobApi';
import Image from 'next/image';
import JobDetail from './JobDetail';
import { Job } from '@/misc/types';

interface ModalProps {
    data: string;
}

const Modal = ({ data }: ModalProps) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState<Job>();

    const { getJobCompleteById } = JobApi();

    const fetchData = async () => {
        if (!token) {
            setLoading(true);
            return;
        }
        try {
            setLoading(true);
            const response = await getJobCompleteById(data, token);
            setJob(response);
        } catch (error) {
            console.error('Failed to fetch jobs data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-t-transparent border-white animate-spin rounded-full"></div>
                    <p className="mt-4 text-white">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-5">
                {job?.postOptionsType === 0 ? (
                    <Image
                        style={{
                            aspectRatio: '9/16',
                            width: 'auto',
                            height: '100%',
                            maxWidth: '100%',
                        }}
                        className="w-auto h-auto object-cover"
                        src={`${process.env.NEXT_PUBLIC_API_URL}/FileStorage/Image/${job?.fileStorageId}?keepRatio=true`}
                        alt="Content Image"
                        quality={100}
                        width={1000}
                        height={1000}
                        priority
                    />
                ) : (
                    <video
                        style={{
                            aspectRatio: '9/16',
                            width: 'auto',
                            height: '100%',
                            maxWidth: '100%',
                        }}
                        className="rounded-lg border"
                        autoPlay
                        muted
                        loop
                        src={`${process.env.NEXT_PUBLIC_API_URL}/FileStorage/Video/${job?.fileStorageId}`}
                    ></video>
                )}
            </div>
            <JobDetail job={job} />
        </div>
    );
};

export default Modal;
