import { v4 as uuidv4 } from 'uuid';

export const createInitialData = () => {
  const col1Id = uuidv4();
  const col2Id = uuidv4();
  const col3Id = uuidv4();

  return {
    columns: [
      { id: col1Id, title: 'To Do', color: '#5b6aff' },
      { id: col2Id, title: 'In Progress', color: '#f5a623' },
      { id: col3Id, title: 'Done', color: '#3ecf8e' },
    ],
    cards: {
      [col1Id]: [
        {
          id: uuidv4(),
          title: 'Design wireframes',
          description: 'Create initial wireframes for the new dashboard layout.',
          createdAt: Date.now() - 86400000 * 2,
        },
        {
          id: uuidv4(),
          title: 'Set up CI/CD pipeline',
          description: '',
          createdAt: Date.now() - 86400000,
        },
        {
          id: uuidv4(),
          title: 'Write unit tests',
          description: 'Cover all critical service functions with unit tests.',
          createdAt: Date.now(),
        },
      ],
      [col2Id]: [
        {
          id: uuidv4(),
          title: 'Build authentication flow',
          description: 'Implement login, signup, and password reset screens.',
          createdAt: Date.now() - 3600000 * 5,
        },
        {
          id: uuidv4(),
          title: 'Integrate REST API',
          description: '',
          createdAt: Date.now() - 3600000 * 2,
        },
      ],
      [col3Id]: [
        {
          id: uuidv4(),
          title: 'Project setup',
          description: 'Initialize repo, install dependencies, configure linting.',
          createdAt: Date.now() - 86400000 * 5,
        },
      ],
    },
  };
};
