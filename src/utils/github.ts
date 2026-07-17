export const getTodayCommits = async (username: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);
    if (!response.ok) return 0;
    const events = await response.json();
    
    // Get today's date in YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Filter for PushEvents that happened today
    const pushEvents = events.filter((e: any) => 
      e.type === 'PushEvent' && e.created_at.startsWith(todayStr)
    );
    
    // Sum up the commits
    const todayCommits = pushEvents.reduce((sum: number, event: any) => 
      sum + (event.payload?.commits?.length || 0), 0
    );
    
    return todayCommits;
  } catch (err) {
    console.error("Error fetching realtime commits:", err);
    return 0;
  }
};
