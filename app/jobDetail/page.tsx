import React from 'react';
import { Input } from '@/components/ui/input';
import { formatDate, getStatusMapping } from '@/lib/utils';
import { Job } from '@/misc/types';

interface JobDetailProps {
    job: Job | undefined;
}

const JobDetail: React.FC<JobDetailProps> = ({ job }) => {
    const { className, text } = getStatusMapping(typeof job?.status === 'number' ? job.status : 7);

    return (
        <div className="col-span-7">
            <div className="flex items-center justify-between py-2">
                <h1>รายการ</h1>
                <Input className="w-3/4" type="text" readOnly />
            </div>
            <div className="flex items-center justify-between py-2">
                <p>ผู้ส่ง</p>
                <Input className="w-3/4" type="text" value={job?.socialMedia || ''} readOnly />
            </div>
            <div className="flex items-center justify-between py-2">
                <p>ข้อความ</p>
                <Input className="w-3/4" type="text" value={job?.caption || ''} readOnly />
            </div>
            <div className="flex items-center justify-between py-2">
                <p>ตัวเลือกที่โพสต์</p>
                <Input
                    className="w-3/4"
                    type="text"
                    value={job?.postOptionsType === 0 ? 'รูปภาพ' : job?.postOptionsType === 1 ? 'วีดีโอ' : ''}
                    readOnly
                />
            </div>
            <div className="flex items-center justify-between py-2">
                <p>ราคา</p>
                <Input className="w-3/4" type="text" value={job?.price || ''} readOnly />
            </div>
            <div className="flex items-center justify-between py-2">
                <p>วันและเวลา</p>
                <Input className="w-3/4" type="text" value={job?.createDate ? formatDate(job.createDate) : 'N/A'} readOnly />
            </div>
            <div className="flex items-center justify-between py-2">
                <p>เบอร์โทรศัพท์</p>
                <Input className="w-3/4" type="text" value={job?.phoneNumber || ''} readOnly />
            </div>
            <div className="flex items-center gap-x-3 justify-between py-2">
                <p>สถานะ</p>
                <Input className={`w-3/4 bg-white ${className}`} type="text" value={text} readOnly />
            </div>
        </div>
    );
};

export default JobDetail;