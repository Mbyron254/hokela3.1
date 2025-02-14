import { useQuery } from '@apollo/client';
import { Q_SESSIONS } from 'src/lib/queries/session.query';

const SessionWidget = () => {
  const { data, loading, error } = useQuery(Q_SESSIONS, {
    variables: {
      input: {
        page: 1,
        pageSize: 1000, // Adjust based on your needs
        orderBy: 'created',
        orderDir: 'DESC'
      }
    }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading sessions</div>;

  const sessions = data?.sessions.rows || [];
  const activeSessions = sessions.filter((session: any) => !session.locked).length;
  const dormantSessions = sessions.filter((session: any) => session.locked).length;

  return (
    <div className="w-full">
      <div className="pb-2">
        <h3 className="text-lg font-semibold">Session Status</h3>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeSessions}</div>
            <div className="text-sm text-muted-foreground">Active Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{dormantSessions}</div>
            <div className="text-sm text-muted-foreground">Dormant Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWidget; 