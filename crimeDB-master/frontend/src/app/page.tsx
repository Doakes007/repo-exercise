'use client'
import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, UserPlus, MessageSquare, FileText, Shield } from 'lucide-react';

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  complaint_details: string;
  status: string;
  created_at: string;
}

interface StatItem {
  label: string;
  value: number | Applicant[];
}

interface ApiResponse {
  success: boolean;
  data: StatItem[];
}

const HomePage = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Total Records', value: 0 },
    { label: 'Active Cases', value: 0 },
    { label: 'Records Added Today', value: 0 },
    { label: 'Recent Updates', value: 0 },
  ]);
  const [recentApplicants, setRecentApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/stats`);
        const data: ApiResponse = await res.json();
        
        if (data.success) {
          // Filter out the recent applicants and set them separately
          const applicantsData = data.data.find(item => item.label === "recent Applicants");
          const filteredStats = data.data.filter(item => item.label !== "recent Applicants");
          
          setStats(filteredStats);
          if (applicantsData && Array.isArray(applicantsData.value)) {
            setRecentApplicants(applicantsData.value);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: 'Search Records',
      description: 'Quick access to criminal records with advanced search capabilities',
      link: '/search',
    },
    {
      icon: <UserPlus className="h-8 w-8 text-green-500" />,
      title: 'Add Record',
      description: 'Create and manage new criminal records with detailed information',
      link: '/newcriminal',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      title: 'Register Complaint',
      description: 'File a new complaint or report suspicious activity',
      link: '/complaint',
    },
    {
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      title: 'Feedback',
      description: 'Share your experience and help us improve our services',
      link: '/feedback',
    },
  ];

  const formatDate = (dateString: string): string => {
    const date:any = new Date(dateString);
    const now:any = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CrimeDB-The Criminal Database</h1>
              <p className="mt-2 text-gray-600">Secure. Efficient. Reliable.</p>
            </div>
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value.toString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <a 
              href={feature.link} 
              key={index} 
              className="no-underline"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = feature.link;
              }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-gray-50 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Complaints</h2>
            {/* <Button variant="outline" onClick={() => window.location.href = '/activity'}>
              View All
            </Button> */}
          </div>
          <div className="space-y-4">
            {recentApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">
                    Case #{applicant.id} - {applicant.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {applicant.complaint_details}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      applicant.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {applicant.status}
                    </span>
                    <span className="text-xs text-gray-500">{applicant.phone}</span>
                    {/* <span className="text-xs text-gray-500">{applicant.email}</span> */}
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(applicant.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;