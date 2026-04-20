'use client'

import DashboardLayout from '@/components/DashboardLayout'
import PageHeader from '@/components/PageHeader'
import { Mail, MessageCircle, BookOpen, HelpCircle } from 'lucide-react'

export default function HelpPage() {
  const topics = [
    { icon: BookOpen, title: 'Getting Started', desc: 'Learn the basics of managing your cooperative' },
    { icon: MessageCircle, title: 'Contact Support', desc: 'Reach out to our team for assistance' },
    { icon: HelpCircle, title: 'FAQs', desc: 'Answers to common questions' },
    { icon: Mail, title: 'Email Us', desc: 'support@gbajo.com' },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Help & Support" subtitle="We're here to help you succeed" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
        {topics.map((t, i) => {
          const Icon = t.icon
          return (
            <div key={i} className="card card-hover cursor-pointer">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t.title}</h3>
              <p className="text-sm text-gray-500">{t.desc}</p>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
