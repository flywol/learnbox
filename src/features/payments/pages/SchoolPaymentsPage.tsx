import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, FileText, Upload } from 'lucide-react';
import { useSchoolPayments } from '../hooks/useSchoolPayments';
import { TransactionTableSection } from '../components/TransactionTableSection';
import type { TransactionData } from '../types/payment.types';

interface PaymentClassData {
  level: string;
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  paidPercentage: number;
}

interface MonthlyData {
  month: string;
  paid: number;
  pending: number;
}


interface FeeDocument {
  id: string;
  title: string;
  classLevel: string;
  session: string;
  term: string;
  amount: number;
  feeType: string;
  fileName: string;
  uploadDate: string;
}

const SchoolPaymentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'fees'>('overview');
  const [showCreateFee, setShowCreateFee] = useState(false);
  const navigate = useNavigate();
  
  const { data: paymentsData, isLoading, error } = useSchoolPayments();

  // Transform API data to component format
  const paymentData: PaymentClassData[] = paymentsData?.classes.map(cls => ({
    level: cls.name,
    totalRevenue: cls.totalRevenue,
    totalPaid: cls.totalPaid,
    totalPending: cls.totalPending,
    paidPercentage: cls.percentagePaid,
  })) || [];

  const monthlyData: MonthlyData[] = paymentsData?.timeline.map(item => ({
    month: item.month.substring(0, 3), // Convert "January" to "Jan"
    paid: Math.round(item.paid / 1000), // Convert to thousands for chart readability
    pending: Math.round(item.pending / 1000),
  })) || [];

  const transactionData: TransactionData[] = [
    {
      id: '1',
      studentName: 'Jane Doe',
      parentName: 'Jane Doe',
      classLevel: 'JSS 1',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: 'Today',
      totalAmount: 300000,
      amountPaid: 300000,
      studentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b134?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '2',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 2',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 500000,
      amountPaid: 500000,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '3',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'SSS 3',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 150000,
      amountPaid: 150000,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '4',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 2',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 150000,
      amountPaid: 150000,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '5',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 1',
      paymentStatus: 'pending',
      transactionId: null,
      dateReceived: null,
      totalAmount: 150000,
      amountPaid: 0,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '6',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 1',
      paymentStatus: 'pending',
      transactionId: null,
      dateReceived: null,
      totalAmount: 25000,
      amountPaid: 0,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '7',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 3',
      paymentStatus: 'pending',
      transactionId: null,
      dateReceived: null,
      totalAmount: 25000,
      amountPaid: 0,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '8',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 2',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 25000,
      amountPaid: 25000,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '9',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 1',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 25000,
      amountPaid: 25000,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
    {
      id: '10',
      studentName: 'James Doe',
      parentName: 'James Doe',
      classLevel: 'JSS 1',
      paymentStatus: 'paid',
      transactionId: 'TRX123456',
      dateReceived: '10/03/2023',
      totalAmount: 25000,
      amountPaid: 25000,
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      parentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  ];

  const feeDocuments: FeeDocument[] = [
    {
      id: '1',
      title: 'JSS1 school fees upload',
      classLevel: 'JSS 1',
      session: '2023/2024',
      term: '1st term',
      amount: 50000,
      feeType: 'School fees',
      fileName: 'jss1_fees_2024.pdf',
      uploadDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'JSS1 school fees upload',
      classLevel: 'JSS 1',
      session: '2023/2024', 
      term: '2nd term',
      amount: 50000,
      feeType: 'School fees',
      fileName: 'jss1_fees_term2_2024.pdf',
      uploadDate: '2024-04-15',
    },
    {
      id: '3',
      title: 'JSS1 school fees upload',
      classLevel: 'JSS 1',
      session: '2023/2024',
      term: '3rd term',
      amount: 50000,
      feeType: 'School fees',
      fileName: 'jss1_fees_term3_2024.pdf',
      uploadDate: '2024-08-15',
    },
  ];

  const classLevels = ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'];
  const sessions = ['2022/2023', '2023/2024'];
  const terms = ['1st term', '2nd term', '3rd term'];
  const feeTypes = ['School fees', 'Exam fees', 'Development levy', 'Sports fees'];

  // Use API overview data
  const totalSchoolRevenue = paymentsData?.overview.totalRevenue || 0;
  const totalPaid = paymentsData?.overview.totalPaid || 0;
  const totalPending = paymentsData?.overview.totalPending || 0;
  const totalStudents = paymentsData?.overview.totalStudents || 0;
  const studentsPaid = paymentsData?.overview.studentsPaid || 0;
  const studentsPending = paymentsData?.overview.studentsPending || 0;


  const handleExportTransactions = (selectedIds: string[]) => {
    console.log('Exporting selected transactions:', selectedIds);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const PaymentClassCard: React.FC<{ data: PaymentClassData }> = ({ data }) => {
    const chartData = [
      { name: 'Paid', value: data.totalPaid, color: '#F97316' },
      { name: 'Pending', value: data.totalPending, color: '#E5E7EB' },
    ];

    return (
      <div 
        className="bg-white p-4 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/payments/${data.level.toLowerCase().replace(' ', '-')}`)}
      >
        <h3 className="text-lg font-semibold mb-3">{data.level}</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{formatCurrency(data.totalRevenue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{formatCurrency(data.totalPaid)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-600">{formatCurrency(data.totalPending)}</span>
            </div>
          </div>
          <div className="relative w-20 h-20">
            {data.totalRevenue > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-xs text-gray-500">0%</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-semibold">{data.paidPercentage}%</div>
                <div className="text-xs text-gray-500">paid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">School Payments</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Loading payment data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">School Payments</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">Failed to load payment data</div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">School Payments</h1>
        
        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-6 border-b border-gray-200">
          {(['overview', 'transactions', 'fees'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'transactions' ? 'Transaction list' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Legend */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Total pending</span>
              </div>
            </div>

            {/* Payment Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paymentData.map((classData) => (
                <PaymentClassCard key={classData.level} data={classData} />
              ))}
            </div>

            {/* School Payment Overview */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-6">School Payment Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total school revenue:</span>
                    <span className="font-semibold">{formatCurrency(totalSchoolRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total paid:</span>
                    <span className="font-semibold">{formatCurrency(totalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total pending:</span>
                    <span className="font-semibold">{formatCurrency(totalPending)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total students:</span>
                    <span className="font-semibold">{totalStudents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Students paid:</span>
                    <span className="font-semibold">{studentsPaid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Students pending:</span>
                    <span className="font-semibold">{studentsPending}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Bar Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Monthly Payment Overview</h2>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-sm text-gray-600">Total paid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-sm text-gray-600">Total pending</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      label={{ value: 'Number of students', angle: -90, position: 'insideLeft' }}
                    />
                    <Bar dataKey="paid" fill="#F97316" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="pending" fill="#E5E7EB" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <TransactionTableSection
            data={transactionData}
            isLoading={isLoading}
            onExport={handleExportTransactions}
          />
        )}

        {activeTab === 'fees' && (
          <>
            {!showCreateFee ? (
              <>
                {/* Create Fee Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setShowCreateFee(true)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Create fee
                  </button>
                </div>

                {/* Fee Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {feeDocuments.map((doc) => (
                    <div key={doc.id} className="bg-white p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <FileText className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {doc.title}
                            </h3>
                          </div>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      
                      {/* Document Preview */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="w-full h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <div className="text-xs text-gray-500">PDF Preview</div>
                          </div>
                        </div>
                      </div>

                      {/* Document Details */}
                      <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Class:</span>
                          <span className="font-medium">{doc.classLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Session:</span>
                          <span className="font-medium">{doc.session}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Term:</span>
                          <span className="font-medium">{doc.term}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium">{formatCurrency(doc.amount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Create Fee Form */
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Create New Fee</h2>
                  <button
                    onClick={() => setShowCreateFee(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Class Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class level
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
                        <option value="">Select class level</option>
                        {classLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Session */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
                        <option value="">Select session</option>
                        {sessions.map((session) => (
                          <option key={session} value={session}>
                            {session}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Term */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Term
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
                        <option value="">Select term</option>
                        {terms.map((term) => (
                          <option key={term} value={term}>
                            {term}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Fee Type */}
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fee type
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
                        <option value="">Select fee type</option>
                        {feeTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Fee Document
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-50 rounded-full mb-4">
                          <Upload className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-gray-600 mb-2">
                          Drag and drop or{' '}
                          <button className="text-orange-500 hover:underline">
                            select file
                          </button>{' '}
                          to upload
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    Upload
                  </button>
                </div>
              </div>
            )}
          </>
        )}
    </div>
  );
};

export default SchoolPaymentsPage;