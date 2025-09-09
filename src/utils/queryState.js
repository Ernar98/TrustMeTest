export function parseQuery (search) {
  const p = new URLSearchParams(search || window.location.search);
  const areaMin = p.get('areaMin');
  const areaMax = p.get('areaMax');
  const roomsMin = p.get('roomsMin');
  const roomsMax = p.get('roomsMax');
  const addr = p.get('q');
  return {
    areaMin: areaMin !== null ? Number(areaMin) : '',
    areaMax: areaMax !== null ? Number(areaMax) : '',
    roomsMin: roomsMin !== null ? Number(roomsMin) : '',
    roomsMax: roomsMax !== null ? Number(roomsMax) : '',
    q: addr || ''
  };
}

export function pushQuery (state) {
  const p = new URLSearchParams();
  if (state.areaMin !== '' && !Number.isNaN(Number(state.areaMin))) p.set('areaMin', String(state.areaMin));
  if (state.areaMax !== '' && !Number.isNaN(Number(state.areaMax))) p.set('areaMax', String(state.areaMax));
  if (state.roomsMin !== '' && !Number.isNaN(Number(state.roomsMin))) p.set('roomsMin', String(state.roomsMin));
  if (state.roomsMax !== '' && !Number.isNaN(Number(state.roomsMax))) p.set('roomsMax', String(state.roomsMax));
  if (state.q && state.q.trim()) p.set('q', state.q.trim());
  const url = `${window.location.pathname}?${p.toString()}`;
  window.history.replaceState({}, '', url);
}
