// Fake in-memory database of people for search/autocomplete

export interface Person {
  id: string
  fullName: string
  jobTitle: string
  avatarUrl: string
  email?: string
  department?: string
  isPurchaser?: boolean
  isCustom?: boolean
  workLocation?: string
  manager?: string
  tenure?: string
  employeeType?: string
}

// Store for custom attendees
let customAttendees: Person[] = []
let customIdCounter = 1000 // Start from 1000 to avoid conflicts

// Purchaser ID constant
export const PURCHASER_ID = "purchaser-lando-norris"

// Generate avatar URL using UI Avatars service
const getAvatarUrl = (name: string, size: number = 40): string => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  
  // Using UI Avatars service - generates avatars with initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=random&color=fff&bold=true`
}

// Alternative: Using DiceBear API for more variety
const getDiceBearAvatar = (seed: string, style: string = "avataaars"): string => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`
}

// Fake people database
export const peopleDatabase: Person[] = [
  {
    id: PURCHASER_ID,
    fullName: "Lando Norris",
    jobTitle: "5% Machine 95% Results",
    avatarUrl: getAvatarUrl("Lando Norris"),
    email: "sriram@rippling.com",
    department: "Product Marketing",
    isPurchaser: true,
    workLocation: "San Francisco",
    manager: "Gang Wang",
    tenure: "8 years, 1 month",
    employeeType: "Employee",
  },
  {
    id: "1",
    fullName: "Jordan Alvarez",
    jobTitle: "Senior Product Manager",
    avatarUrl: getAvatarUrl("Jordan Alvarez"),
    email: "jordan.alvarez@company.com",
    department: "Product",
    workLocation: "New York",
    manager: "Alex Chen",
    tenure: "3 years, 2 months",
    employeeType: "Employee",
  },
  {
    id: "2",
    fullName: "Alexandra Chen",
    jobTitle: "Lead Software Engineer",
    avatarUrl: getAvatarUrl("Alexandra Chen"),
    email: "alexandra.chen@company.com",
    department: "Engineering",
    workLocation: "Seattle",
    manager: "David Kim",
    tenure: "5 years, 3 months",
    employeeType: "Employee",
  },
  {
    id: "3",
    fullName: "Marcus Thompson",
    jobTitle: "UX Designer",
    avatarUrl: getAvatarUrl("Marcus Thompson"),
    email: "marcus.thompson@company.com",
    department: "Design",
    workLocation: "Austin",
    manager: "Olivia Martinez",
    tenure: "2 years, 8 months",
    employeeType: "Employee",
  },
  {
    id: "4",
    fullName: "Sofia Rodriguez",
    jobTitle: "Data Scientist",
    avatarUrl: getAvatarUrl("Sofia Rodriguez"),
    email: "sofia.rodriguez@company.com",
    department: "Data",
    workLocation: "Boston",
    manager: "Alexandra Chen",
    tenure: "1 year, 7 months",
    employeeType: "Employee",
  },
  {
    id: "5",
    fullName: "David Kim",
    jobTitle: "Marketing Director",
    avatarUrl: getAvatarUrl("David Kim"),
    email: "david.kim@company.com",
    department: "Marketing",
    workLocation: "Los Angeles",
    manager: "Ava Wilson",
    tenure: "6 years, 4 months",
    employeeType: "Employee",
  },
  {
    id: "6",
    fullName: "Emily Watson",
    jobTitle: "Senior Frontend Developer",
    avatarUrl: getAvatarUrl("Emily Watson"),
    email: "emily.watson@company.com",
    department: "Engineering",
    workLocation: "Seattle",
    manager: "David Kim",
    tenure: "4 years, 9 months",
    employeeType: "Employee",
  },
  {
    id: "7",
    fullName: "James Mitchell",
    jobTitle: "DevOps Engineer",
    avatarUrl: getAvatarUrl("James Mitchell"),
    email: "james.mitchell@company.com",
    department: "Engineering",
    workLocation: "San Francisco",
    manager: "Alexandra Chen",
    tenure: "2 years, 1 month",
    employeeType: "Employee",
  },
  {
    id: "8",
    fullName: "Olivia Martinez",
    jobTitle: "Product Designer",
    avatarUrl: getAvatarUrl("Olivia Martinez"),
    email: "olivia.martinez@company.com",
    department: "Design",
    workLocation: "Austin",
    manager: "Harper Walker",
    tenure: "3 years, 11 months",
    employeeType: "Employee",
  },
  {
    id: "9",
    fullName: "Ryan Foster",
    jobTitle: "Backend Engineer",
    avatarUrl: getAvatarUrl("Ryan Foster"),
    email: "ryan.foster@company.com",
    department: "Engineering",
    workLocation: "New York",
    manager: "David Kim",
    tenure: "1 year, 4 months",
    employeeType: "Employee",
  },
  {
    id: "10",
    fullName: "Isabella Garcia",
    jobTitle: "Content Strategist",
    avatarUrl: getAvatarUrl("Isabella Garcia"),
    email: "isabella.garcia@company.com",
    department: "Marketing",
    workLocation: "Chicago",
    manager: "David Kim",
    tenure: "2 years, 6 months",
    employeeType: "Employee",
  },
  {
    id: "11",
    fullName: "Michael Brown",
    jobTitle: "QA Engineer",
    avatarUrl: getAvatarUrl("Michael Brown"),
    email: "michael.brown@company.com",
    department: "Engineering",
    workLocation: "Seattle",
    manager: "Alexandra Chen",
    tenure: "3 years, 3 months",
    employeeType: "Employee",
  },
  {
    id: "12",
    fullName: "Charlotte Lee",
    jobTitle: "Business Analyst",
    avatarUrl: getAvatarUrl("Charlotte Lee"),
    email: "charlotte.lee@company.com",
    department: "Product",
    workLocation: "Denver",
    manager: "Jordan Alvarez",
    tenure: "1 year, 9 months",
    employeeType: "Employee",
  },
  {
    id: "13",
    fullName: "Daniel White",
    jobTitle: "Sales Manager",
    avatarUrl: getAvatarUrl("Daniel White"),
    email: "daniel.white@company.com",
    department: "Sales",
    workLocation: "Phoenix",
    manager: "Mia Johnson",
    tenure: "5 years, 7 months",
    employeeType: "Employee",
  },
  {
    id: "14",
    fullName: "Amelia Taylor",
    jobTitle: "HR Specialist",
    avatarUrl: getAvatarUrl("Amelia Taylor"),
    email: "amelia.taylor@company.com",
    department: "HR",
    workLocation: "Portland",
    manager: "Emma Clark",
    tenure: "2 years, 2 months",
    employeeType: "Employee",
  },
  {
    id: "15",
    fullName: "Lucas Anderson",
    jobTitle: "Security Engineer",
    avatarUrl: getAvatarUrl("Lucas Anderson"),
    email: "lucas.anderson@company.com",
    department: "Engineering",
    workLocation: "San Francisco",
    manager: "Alexandra Chen",
    tenure: "4 years, 5 months",
    employeeType: "Employee",
  },
  {
    id: "16",
    fullName: "Mia Johnson",
    jobTitle: "Customer Success Manager",
    avatarUrl: getAvatarUrl("Mia Johnson"),
    email: "mia.johnson@company.com",
    department: "Customer Success",
    workLocation: "Miami",
    manager: "Daniel White",
    tenure: "6 years, 8 months",
    employeeType: "Employee",
  },
  {
    id: "17",
    fullName: "Ethan Davis",
    jobTitle: "Mobile Developer",
    avatarUrl: getAvatarUrl("Ethan Davis"),
    email: "ethan.davis@company.com",
    department: "Engineering",
    workLocation: "Austin",
    manager: "David Kim",
    tenure: "1 year, 11 months",
    employeeType: "Employee",
  },
  {
    id: "18",
    fullName: "Ava Wilson",
    jobTitle: "Product Marketing Manager",
    avatarUrl: getAvatarUrl("Ava Wilson"),
    email: "ava.wilson@company.com",
    department: "Marketing",
    workLocation: "New York",
    manager: "David Kim",
    tenure: "7 years, 2 months",
    employeeType: "Employee",
  },
  {
    id: "19",
    fullName: "Noah Moore",
    jobTitle: "Technical Writer",
    avatarUrl: getAvatarUrl("Noah Moore"),
    email: "noah.moore@company.com",
    department: "Engineering",
    workLocation: "Seattle",
    manager: "Alexandra Chen",
    tenure: "2 years, 10 months",
    employeeType: "Employee",
  },
  {
    id: "20",
    fullName: "Sophia Jackson",
    jobTitle: "Finance Analyst",
    avatarUrl: getAvatarUrl("Sophia Jackson"),
    email: "sophia.jackson@company.com",
    department: "Finance",
    workLocation: "San Francisco",
    manager: "Emma Clark",
    tenure: "3 years, 6 months",
    employeeType: "Employee",
  },
  {
    id: "21",
    fullName: "Liam Harris",
    jobTitle: "Full Stack Developer",
    avatarUrl: getAvatarUrl("Liam Harris"),
    email: "liam.harris@company.com",
    department: "Engineering",
    workLocation: "Boston",
    manager: "David Kim",
    tenure: "1 year, 2 months",
    employeeType: "Employee",
  },
  {
    id: "22",
    fullName: "Emma Clark",
    jobTitle: "Operations Manager",
    avatarUrl: getAvatarUrl("Emma Clark"),
    email: "emma.clark@company.com",
    department: "Operations",
    workLocation: "San Francisco",
    manager: "Gang Wang",
    tenure: "9 years, 3 months",
    employeeType: "Employee",
  },
  {
    id: "23",
    fullName: "Oliver Lewis",
    jobTitle: "Growth Hacker",
    avatarUrl: getAvatarUrl("Oliver Lewis"),
    email: "oliver.lewis@company.com",
    department: "Marketing",
    workLocation: "Los Angeles",
    manager: "David Kim",
    tenure: "2 years, 4 months",
    employeeType: "Employee",
  },
  {
    id: "24",
    fullName: "Harper Walker",
    jobTitle: "UI Designer",
    avatarUrl: getAvatarUrl("Harper Walker"),
    email: "harper.walker@company.com",
    department: "Design",
    workLocation: "Austin",
    manager: "Olivia Martinez",
    tenure: "4 years, 2 months",
    employeeType: "Employee",
  },
  {
    id: "25",
    fullName: "Aiden Hall",
    jobTitle: "Site Reliability Engineer",
    avatarUrl: getAvatarUrl("Aiden Hall"),
    email: "aiden.hall@company.com",
    department: "Engineering",
    workLocation: "Seattle",
    manager: "Alexandra Chen",
    tenure: "3 years, 8 months",
    employeeType: "Employee",
  },
  {
    id: "26",
    fullName: "Evelyn Young",
    jobTitle: "Research Scientist",
    avatarUrl: getAvatarUrl("Evelyn Young"),
    email: "evelyn.young@company.com",
    department: "Research",
    workLocation: "Boston",
    manager: "Sofia Rodriguez",
    tenure: "5 years, 1 month",
    employeeType: "Employee",
  },
  {
    id: "27",
    fullName: "Carter King",
    jobTitle: "Product Owner",
    avatarUrl: getAvatarUrl("Carter King"),
    email: "carter.king@company.com",
    department: "Product",
    workLocation: "New York",
    manager: "Jordan Alvarez",
    tenure: "2 years, 7 months",
    employeeType: "Employee",
  },
  {
    id: "28",
    fullName: "Luna Wright",
    jobTitle: "Brand Designer",
    avatarUrl: getAvatarUrl("Luna Wright"),
    email: "luna.wright@company.com",
    department: "Design",
    workLocation: "Portland",
    manager: "Olivia Martinez",
    tenure: "1 year, 6 months",
    employeeType: "Employee",
  },
  {
    id: "29",
    fullName: "Mason Lopez",
    jobTitle: "Cloud Architect",
    avatarUrl: getAvatarUrl("Mason Lopez"),
    email: "mason.lopez@company.com",
    department: "Engineering",
    workLocation: "San Francisco",
    manager: "Alexandra Chen",
    tenure: "6 years, 9 months",
    employeeType: "Employee",
  },
  {
    id: "30",
    fullName: "Zoe Hill",
    jobTitle: "Community Manager",
    avatarUrl: getAvatarUrl("Zoe Hill"),
    email: "zoe.hill@company.com",
    department: "Marketing",
    workLocation: "Chicago",
    manager: "David Kim",
    tenure: "1 year, 8 months",
    employeeType: "Employee",
  },
]

// Search function to filter people by name, job title, or email
export const searchPeople = (
  query: string,
  excludeIds: string[] = []
): Person[] => {
  if (!query.trim()) {
    const allPeople = [...peopleDatabase, ...customAttendees]
    return allPeople.filter((person) => !excludeIds.includes(person.id))
  }

  const lowerQuery = query.toLowerCase()
  const allPeople = [...peopleDatabase, ...customAttendees]
  
  return allPeople
    .filter((person) => !excludeIds.includes(person.id))
    .filter(
      (person) =>
        person.fullName.toLowerCase().includes(lowerQuery) ||
        person.jobTitle.toLowerCase().includes(lowerQuery) ||
        person.email?.toLowerCase().includes(lowerQuery) ||
        person.department?.toLowerCase().includes(lowerQuery)
    )
}

// Get person by ID
export const getPersonById = (id: string): Person | undefined => {
  const allPeople = [...peopleDatabase, ...customAttendees]
  return allPeople.find((person) => person.id === id)
}

// Get all people (excluding certain IDs)
export const getAllPeople = (excludeIds: string[] = []): Person[] => {
  const allPeople = [...peopleDatabase, ...customAttendees]
  return allPeople.filter((person) => !excludeIds.includes(person.id))
}

// Create a new custom attendee
export const createCustomAttendee = (fullName: string): Person => {
  const customId = `custom-${customIdCounter++}`
  const trimmedName = fullName.trim()
  const email = `${trimmedName.toLowerCase().replace(/\s+/g, '.')}@company.com`
  const customPerson: Person = {
    id: customId,
    fullName: trimmedName,
    jobTitle: "Custom attendee",
    avatarUrl: getAvatarUrl(trimmedName),
    email: email,
    department: "Custom",
    isCustom: true,
    workLocation: "Remote",
    manager: "TBD",
    tenure: "New",
    employeeType: "Employee",
  }
  customAttendees.push(customPerson)
  return customPerson
}

// Check if a name already exists (case-insensitive)
export const personExists = (fullName: string): boolean => {
  const allPeople = [...peopleDatabase, ...customAttendees]
  return allPeople.some(
    (person) => person.fullName.toLowerCase() === fullName.trim().toLowerCase()
  )
}
