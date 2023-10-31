const Tempe = ({ pastenList }: { pastenList: any }) => {
  const chooseBackgroundForTable = (color?: string) => {
    if (pastenList.length === 1)
      return {
        backgroundColor: pastenList[0].color,
        color: "white",
        // background: "linear-gradient(-45deg, #4a5568 50%, #cbd5e0 50%)",
      };
    else
      return {
        color: "white",
        background: `linear-gradient(-45deg, ${pastenList[1].color} 50%, ${pastenList[0].color} 50%)`,
      };
  };
  if (pastenList.length !== 0)
    return (
      <div className="flex flex-col">
        <span
          className="divide-x divide-gray h-30 w-30"
          style={chooseBackgroundForTable(pastenList)}
        />
      </div>
    );
  else return null;
};

export default Tempe;
