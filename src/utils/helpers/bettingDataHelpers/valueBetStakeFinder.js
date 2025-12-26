import { kelleyBetSizeCalc } from "./helperFunctions";
import { calculateProfitFromUSOdds } from "../../constants"
import { useSelector } from "react-redux";

export const valueBetStakeFinder = (games, startingBankroll, pctKelley = .25) => {
    games = games.sort((a, b) => b.predictionConfidence - a.predictionConfidence)
    let stakeList = []
    let dayBankroll = startingBankroll
    for (const g of games) {
        const bookmaker = g.bookmakers?.find((b) => b.key === "fanduel");
        const market = bookmaker?.markets?.find((m) => m.key === "h2h");
        const outcome = market?.outcomes?.find((o) =>
            o.name ===
            (g.predictedWinner === "home"
                ? g.homeTeamDetails.espnDisplayName
                : g.awayTeamDetails.espnDisplayName)
        );
        if (!outcome) continue;

        // Kelly fraction adjusted by your pctKelley
        const fraction = kelleyBetSizeCalc(g, outcome) * pctKelley;

        let stake = fraction * dayBankroll;
        if (stake < .09) stake = .09
        stakeList.push({ id: g.id, stake });
        dayBankroll -= stake
    }
    return stakeList
}