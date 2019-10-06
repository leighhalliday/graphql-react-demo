import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import "./App.css";

const EVENTS = gql`
  query EventsQuery {
    events {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

export default function App() {
  const { loading, data } = useQuery(EVENTS);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <main>
      <h1>Worst GraphQL Demo Ever</h1>

      <ul>
        {data.events.map(event => (
          <li key={event.id}>
            <h2>{event.name}</h2>
            <p>Category - {event.category.name}</p>
          </li>
        ))}
      </ul>
      <AddEvent />
    </main>
  );
}

const CATEGORIES = gql`
  query CategoriesQuery {
    categories {
      id
      name
    }
  }
`;

const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      event {
        id
      }
      errors
    }
  }
`;

function AddEvent() {
  const [categoryId, setCategoryId] = React.useState("");
  const [name, setName] = React.useState("");
  const { loading, data } = useQuery(CATEGORIES);
  const [createEvent] = useMutation(CREATE_EVENT);

  if (loading) {
    return null;
  }

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();

        await createEvent({
          variables: {
            input: {
              categoryId,
              name,
              startTime: "2019-10-10T10:10:10",
              endTime: "2019-10-10T11:11:11"
            }
          },
          refetchQueries: [{ query: EVENTS }]
        });

        setCategoryId("");
        setName("");
      }}
    >
      <h2>Create an Event</h2>

      <div>
        <select
          value={categoryId}
          onChange={event => {
            setCategoryId(event.target.value);
          }}
          required
        >
          <option value="">choose</option>
          {data.categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="text"
          value={name}
          onChange={event => {
            setName(event.target.value);
          }}
          placeholder="Event name"
          required
        />
      </div>

      <div>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
