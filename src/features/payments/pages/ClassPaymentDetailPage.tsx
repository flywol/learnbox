import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { StudentPaymentTableSection } from '../components/StudentPaymentTableSection';
import type { StudentPayment } from '../types/payment.types';


const ClassPaymentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Mock data for JSS 1
  const studentPayments: StudentPayment[] = [
    {
      id: '1',
      studentName: 'Jane Doe',
      parentName: 'Jane Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: 'Today',
      totalAmount: 300000,
      amountPaid: 300000,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '2',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 500000,
      amountPaid: 500000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '3',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 150000,
      amountPaid: 150000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '4',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 150000,
      amountPaid: 150000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '5',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'pending',
      transactionId: null,
      dateReceived: null,
      totalAmount: 150000,
      amountPaid: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '6',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'pending',
      transactionId: null,
      dateReceived: null,
      totalAmount: 25000,
      amountPaid: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '7',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'pending',
      transactionId: null,
      dateReceived: null,
      totalAmount: 25000,
      amountPaid: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '8',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 25000,
      amountPaid: 25000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '9',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 25000,
      amountPaid: 25000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '10',
      studentName: 'James Doe',
      parentName: 'James Doe',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 25000,
      amountPaid: 25000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  ];


  const classData = {
    level: classId?.replace('-', ' ').toUpperCase() || 'JSS 1',
    totalRevenue: 1000000,
    totalPaid: 800000,
    totalPending: 200000,
    totalStudents: 100,
    studentsPaid: 80,
    studentsPending: 20,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExport = (selectedIds: string[]) => {
    console.log('Exporting selected students:', selectedIds);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter as 'all' | 'paid' | 'pending');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          {/* Title and Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/payments')}
              className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {classData.level} Payment Overview
            </h1>
          </div>

          {/* Summary Section with Controls */}
          <div className="flex justify-between items-start">
            {/* Left Side - Summary Data */}
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
              <div>
                <span className="text-gray-600">Total revenue: </span>
                <span className="font-bold">{formatCurrency(classData.totalRevenue)}</span>
              </div>
              <div>
                <span className="text-gray-600">Total students: </span>
                <span className="font-bold">{classData.totalStudents}</span>
              </div>
              <div>
                <span className="text-gray-600">Total paid: </span>
                <span className="font-bold">{formatCurrency(classData.totalPaid)}</span>
              </div>
              <div>
                <span className="text-gray-600">Students paid: </span>
                <span className="font-bold">{classData.studentsPaid}</span>
              </div>
              <div>
                <span className="text-gray-600">Total pending: </span>
                <span className="font-bold">{formatCurrency(classData.totalPending)}</span>
              </div>
              <div>
                <span className="text-gray-600">Students pending: </span>
                <span className="font-bold">{classData.studentsPending}</span>
              </div>
            </div>

            {/* Right Side - Spacer for the controls in the table section */}
            <div></div>
          </div>
        </div>

        {/* Students Table */}
        <StudentPaymentTableSection
          data={studentPayments}
          isLoading={false}
          onExport={handleExport}
          filter={filter}
          onFilterChange={handleFilterChange}
        />
    </div>
  );
};

export default ClassPaymentDetailPage;