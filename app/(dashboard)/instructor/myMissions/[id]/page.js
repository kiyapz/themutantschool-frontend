'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MissionCourseOverview from '../_components/MissionCourseOverview'

export default function Page() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)

  useEffect(() => {
    // Enhanced dummy courses with more comprehensive data
    const dummyCourses = [
      {
        id: '1',
        title: 'Mobile App Design With Figma',
        status: 'Published',
        createdAt: 'Jan 11, 2025',
        updatedAt: '2 Days ago',
        description: `In this course, you'll unlock the core powers of mobile UI/UX design using Figma. Learn to create stunning mobile interfaces, master design systems, and understand user experience principles. This comprehensive course covers everything from basic design principles to advanced prototyping techniques, ensuring you can create professional-grade mobile applications.`,
        analytics: {
          enrollments: 2,
          completionRate: '78%',
          rating: '4.8',
        },
        chapters: [
          {
            id: 'chapter-1',
            title: 'Introduction to Mobile App Design',
            lessons: 3,
            duration: '30m',
            status: 'published',
            lessons_detail: [
              {
                id: 'lesson-1',
                title: 'A Summary of Design',
                type: 'text',
                duration: '10 minutes',
                icon: 'clipboard'
              },
              {
                id: 'lesson-2',
                title: 'Introduction to Mobile Design',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-3',
                title: 'Design Principles Quiz',
                type: 'quiz',
                duration: '5 minutes',
                icon: 'quiz'
              }
            ]
          },
          {
            id: 'chapter-2',
            title: 'Figma Basics',
            lessons: 3,
            duration: '25m',
            status: 'publishedoo',
            lessons_detail: [
              {
                id: 'lesson-4',
                title: 'Basic Tools in Figma',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-5',
                title: 'Creating Your First Design',
                type: 'video',
                duration: '20 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-6',
                title: 'Figma Components',
                type: 'text',
                duration: '10 minutes',
                icon: 'clipboard'
              }
            ]
          }
        ],
        quickActions: [
          {
            id: 'upload',
            title: 'Upload Content',
            description: 'Add videos, documents and other course materials',
            bgColor: 'bg-[#4B68414D]',
            textColor: 'text-[#7BBD25]',
            icon: '!'
          },
          {
            id: 'messages',
            title: 'Students Messages',
            description: '5 New messages awaiting response',
            bgColor: 'bg-[#4953754D]',
            textColor: 'text-[#5F7ADD]',
            icon: '!'
          },
          {
            id: 'analytics',
            title: 'Analytics Report',
            description: 'Generate detail course performance insight',
            bgColor: 'bg-[#73643F4D]',
            textColor: 'text-[#CC6525]',
            icon: '!'
          }
        ]
      },
      {
        id: '2',
        title: 'Frontend Development with React',
        status: 'Draft',
        createdAt: 'Feb 5, 2025',
        updatedAt: '5 Days ago',
        description: `Master the fundamentals of React including hooks, state management, and modern patterns. This course takes you from React basics to advanced concepts like context API, custom hooks, and performance optimization. Perfect for developers looking to build modern, scalable web applications.`,
        analytics: {
          enrollments: 10,
          completionRate: '55%',
          rating: '4.4',
        },
        chapters: [
          {
            id: 'chapter-1',
            title: 'React Fundamentals',
            lessons: 4,
            duration: '45m',
            status: 'published',
            lessons_detail: [
              {
                id: 'lesson-1',
                title: 'Introduction to React',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-2',
                title: 'JSX & Components',
                type: 'text',
                duration: '12 minutes',
                icon: 'clipboard'
              },
              {
                id: 'lesson-3',
                title: 'Props & State',
                type: 'video',
                duration: '18 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-4',
                title: 'React Basics Quiz',
                type: 'quiz',
                duration: '8 minutes',
                icon: 'quiz'
              }
            ]
          },
          {
            id: 'chapter-2',
            title: 'React Hooks',
            lessons: 3,
            duration: '40m',
            status: 'draft',
            lessons_detail: [
              {
                id: 'lesson-5',
                title: 'useState Hook',
                type: 'video',
                duration: '20 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-6',
                title: 'useEffect Hook',
                type: 'video',
                duration: '20 minutes',
                icon: 'play'
              }
            ]
          }
        ],
        quickActions: [
          {
            id: 'upload',
            title: 'Upload Content',
            description: 'Add videos, documents and other course materials',
            bgColor: 'bg-[#4B68414D]',
            textColor: 'text-[#7BBD25]',
            icon: '!'
          },
          {
            id: 'messages',
            title: 'Students Messages',
            description: '12 New messages awaiting response',
            bgColor: 'bg-[#4953754D]',
            textColor: 'text-[#5F7ADD]',
            icon: '!'
          },
          {
            id: 'analytics',
            title: 'Analytics Report',
            description: 'Generate detail course performance insight',
            bgColor: 'bg-[#73643F4D]',
            textColor: 'text-[#CC6525]',
            icon: '!'
          }
        ]
      },
      {
        id: '3',
        title: 'Backend Development with Node.js',
        status: 'Published',
        createdAt: 'Mar 10, 2025',
        updatedAt: '1 Day ago',
        description: `Dive into backend APIs, authentication, and working with databases using Node.js and Express. Learn to build robust server-side applications, implement security best practices, and create scalable backend architectures. This course covers everything from basic server setup to advanced deployment strategies.`,
        analytics: {
          enrollments: 5,
          completionRate: '63%',
          rating: '4.5',
        },
        chapters: [
          {
            id: 'chapter-1',
            title: 'Node.js Fundamentals',
            lessons: 3,
            duration: '35m',
            status: 'published',
            lessons_detail: [
              {
                id: 'lesson-1',
                title: 'Introduction to Node.js',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-2',
                title: 'Setting up Your Environment',
                type: 'text',
                duration: '10 minutes',
                icon: 'clipboard'
              },
              {
                id: 'lesson-3',
                title: 'Your First Server',
                type: 'video',
                duration: '10 minutes',
                icon: 'play'
              }
            ]
          },
          {
            id: 'chapter-2',
            title: 'Express.js Basics',
            lessons: 4,
            duration: '50m',
            status: 'published',
            lessons_detail: [
              {
                id: 'lesson-4',
                title: 'Creating REST APIs',
                type: 'video',
                duration: '20 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-5',
                title: 'Routing & Middleware',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-6',
                title: 'Database Integration',
                type: 'text',
                duration: '15 minutes',
                icon: 'clipboard'
              }
            ]
          }
        ],
        quickActions: [
          {
            id: 'upload',
            title: 'Upload Content',
            description: 'Add videos, documents and other course materials',
            bgColor: 'bg-[#4B68414D]',
            textColor: 'text-[#7BBD25]',
            icon: '!'
          },
          {
            id: 'messages',
            title: 'Students Messages',
            description: '3 New messages awaiting response',
            bgColor: 'bg-[#4953754D]',
            textColor: 'text-[#5F7ADD]',
            icon: '!'
          },
          {
            id: 'analytics',
            title: 'Analytics Report',
            description: 'Generate detail course performance insight',
            bgColor: 'bg-[#73643F4D]',
            textColor: 'text-[#CC6525]',
            icon: '!'
          }
        ]
      },
      {
        id: '4',
        title: 'UI/UX Principles for Beginners',
        status: 'Published',
        createdAt: 'Apr 8, 2025',
        updatedAt: '10 Hours ago',
        description: `Understand essential design thinking, user psychology, and wireframing techniques. This course provides a comprehensive introduction to UI/UX design principles, covering user research methods, design systems, and prototyping tools. Perfect for beginners looking to start their design career.`,
        analytics: {
          enrollments: 7,
          completionRate: '82%',
          rating: '4.9',
        },
        chapters: [
          {
            id: 'chapter-1',
            title: 'Design Fundamentals',
            lessons: 3,
            duration: '40m',
            status: 'published',
            lessons_detail: [
              {
                id: 'lesson-1',
                title: 'User Research Basics',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-2',
                title: 'Creating Wireframes',
                type: 'text',
                duration: '15 minutes',
                icon: 'clipboard'
              },
              {
                id: 'lesson-3',
                title: 'Prototyping Techniques',
                type: 'video',
                duration: '10 minutes',
                icon: 'play'
              }
            ]
          }
        ],
        quickActions: [
          {
            id: 'upload',
            title: 'Upload Content',
            description: 'Add videos, documents and other course materials',
            bgColor: 'bg-[#4B68414D]',
            textColor: 'text-[#7BBD25]',
            icon: '!'
          },
          {
            id: 'messages',
            title: 'Students Messages',
            description: '8 New messages awaiting response',
            bgColor: 'bg-[#4953754D]',
            textColor: 'text-[#5F7ADD]',
            icon: '!'
          },
          {
            id: 'analytics',
            title: 'Analytics Report',
            description: 'Generate detail course performance insight',
            bgColor: 'bg-[#73643F4D]',
            textColor: 'text-[#CC6525]',
            icon: '!'
          }
        ]
      },
      {
        id: '5',
        title: 'Advanced Animation in Web Design',
        status: 'Draft',
        createdAt: 'May 12, 2025',
        updatedAt: '3 Hours ago',
        description: `Explore motion design in websites using CSS, GSAP, and Framer Motion. This advanced course teaches you to create engaging animations that enhance user experience without sacrificing performance. Learn to implement complex animations, micro-interactions, and scroll-triggered effects.`,
        analytics: {
          enrollments: 3,
          completionRate: '41%',
          rating: '4.2',
        },
        chapters: [
          {
            id: 'chapter-1',
            title: 'Motion UI Fundamentals',
            lessons: 3,
            duration: '35m',
            status: 'draft',
            lessons_detail: [
              {
                id: 'lesson-1',
                title: 'Introduction to Animation',
                type: 'video',
                duration: '15 minutes',
                icon: 'play'
              },
              {
                id: 'lesson-2',
                title: 'GSAP Basics',
                type: 'text',
                duration: '15 minutes',
                icon: 'clipboard'
              },
              {
                id: 'lesson-3',
                title: 'Microinteractions',
                type: 'video',
                duration: '5 minutes',
                icon: 'play'
              }
            ]
          }
        ],
        quickActions: [
          {
            id: 'upload',
            title: 'Upload Content',
            description: 'Add videos, documents and other course materials',
            bgColor: 'bg-[#4B68414D]',
            textColor: 'text-[#7BBD25]',
            icon: '!'
          },
          {
            id: 'messages',
            title: 'Students Messages',
            description: '1 New message awaiting response',
            bgColor: 'bg-[#4953754D]',
            textColor: 'text-[#5F7ADD]',
            icon: '!'
          },
          {
            id: 'analytics',
            title: 'Analytics Report',
            description: 'Generate detail course performance insight',
            bgColor: 'bg-[#73643F4D]',
            textColor: 'text-[#CC6525]',
            icon: '!'
          }
        ]
      },
    ]

    const found = dummyCourses.find(c => c.id === id)
    setCourse(found)
  }, [id])

  if (!course) return <p className="text-white p-10">Loading course...</p>

  return <MissionCourseOverview course={course} />
}