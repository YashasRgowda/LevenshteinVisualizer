/**
 * Sample database of user records for fuzzy search demonstration
 * Includes deliberate variations in spelling to showcase the algorithm's effectiveness
 */
export const userRecords = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      company: "Acme Corporation",
      title: "Software Engineer",
      location: "New York, NY"
    },
    {
      id: 2,
      name: "Jon Smyth",
      email: "jon.smyth@example.com",
      company: "Globex Industries",
      title: "UX Designer",
      location: "San Francisco, CA"
    },
    {
      id: 3,
      name: "Jane Johnson",
      email: "jane.johnson@example.com",
      company: "Initech",
      title: "Product Manager",
      location: "Chicago, IL"
    },
    {
      id: 4,
      name: "Jayne Jonson",
      email: "jayne.jonson@example.com",
      company: "Hooli",
      title: "Marketing Director",
      location: "Austin, TX"
    },
    {
      id: 5,
      name: "Michael Williams",
      email: "michael.williams@example.com",
      company: "Stark Industries",
      title: "Senior Developer",
      location: "Boston, MA"
    },
    {
      id: 6,
      name: "Mikael Wiliams",
      email: "mikael.wiliams@example.com",
      company: "Wayne Enterprises",
      title: "System Architect",
      location: "Seattle, WA"
    },
    {
      id: 7,
      name: "Robert Brown",
      email: "robert.brown@example.com",
      company: "Cyberdyne Systems",
      title: "Data Scientist",
      location: "Los Angeles, CA"
    },
    {
      id: 8,
      name: "Robbert Browne",
      email: "robbert.browne@example.com",
      company: "Umbrella Corporation",
      title: "AI Researcher",
      location: "Portland, OR"
    },
    {
      id: 9,
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      company: "Massive Dynamic",
      title: "CTO",
      location: "Denver, CO"
    },
    {
      id: 10,
      name: "Sara Davies",
      email: "sara.davies@example.com",
      company: "Soylent Corp",
      title: "Head of Engineering",
      location: "Miami, FL"
    },
    {
      id: 11,
      name: "Thomas Anderson",
      email: "thomas.anderson@example.com",
      company: "Metacortex",
      title: "Software Developer",
      location: "Seattle, WA"
    },
    {
      id: 12,
      name: "Tom Andersen",
      email: "tom.andersen@example.com",
      company: "Blue Sun Corporation",
      title: "Backend Engineer",
      location: "Philadelphia, PA"
    },
    {
      id: 13,
      name: "Elizabeth Taylor",
      email: "elizabeth.taylor@example.com",
      company: "Tyrell Corporation",
      title: "Frontend Developer",
      location: "San Diego, CA"
    },
    {
      id: 14,
      name: "Elisabeth Tailor",
      email: "elisabeth.tailor@example.com",
      company: "Weyland-Yutani Corp",
      title: "UI/UX Designer",
      location: "Phoenix, AZ"
    },
    {
      id: 15,
      name: "Christopher Martin",
      email: "christopher.martin@example.com",
      company: "Oscorp Industries",
      title: "DevOps Engineer",
      location: "Minneapolis, MN"
    },
    {
      id: 16,
      name: "Kristofer Marten",
      email: "kristofer.marten@example.com",
      company: "LexCorp",
      title: "Cloud Architect",
      location: "Atlanta, GA"
    },
    {
      id: 17,
      name: "David Wilson",
      email: "david.wilson@example.com",
      company: "InGen",
      title: "Security Engineer",
      location: "Dallas, TX"
    },
    {
      id: 18,
      name: "Dave Willson",
      email: "dave.willson@example.com",
      company: "Aperture Science",
      title: "QA Engineer",
      location: "Detroit, MI"
    },
    {
      id: 19,
      name: "Jennifer Lopez",
      email: "jennifer.lopez@example.com",
      company: "Monarch Solutions",
      title: "Project Manager",
      location: "Las Vegas, NV"
    },
    {
      id: 20,
      name: "Jenifer Lopes",
      email: "jenifer.lopes@example.com",
      company: "Abstergo Industries",
      title: "Scrum Master",
      location: "Orlando, FL"
    }
  ];
  
  /**
   * Fields that can be searched for fuzzy matches
   */
  export const searchableFields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "company", label: "Company" },
    { id: "title", label: "Job Title" },
    { id: "location", label: "Location" }
  ];
  
  export default userRecords;