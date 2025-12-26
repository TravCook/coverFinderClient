export const getGameDate = (game) => {
  const d = new Date(game.commence_time);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getLocalDayKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const splitGamesByDay = (games) => {
  return games.reduce((acc, game) => {
    const key = getLocalDayKey(game.commence_time);
    if (!acc[key]) acc[key] = [];
    acc[key].push(game);
    return acc;
  }, {});
};

export const isSameDay = (d1, d2) =>
  getLocalDayKey(d1) === getLocalDayKey(d2);

