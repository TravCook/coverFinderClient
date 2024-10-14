import { useEffect, useState } from 'react'
import { Col, } from 'react-bootstrap'

const OddsDisplayBox = (props) => {
    // const [spreadIndex, setspreadIndex] = useState(0)
    // const [totalsIndex, settotalsIndex] = useState(0)
    const [indexColor, setIndexColor] = useState()


    let indexColors=[{
        key: -10,
        hexCode: '#f20707', 
    },{
        key: -9,
        hexCode: '#f32b08', 
    },{
        key: -8,
        hexCode: '#f33b09', 
    },{
        key: -7,
        hexCode: '#f34e0a', 
    },{
        key: -6,
        hexCode: '#f3600a', 
    },{
        key: -5,
        hexCode: '#f4750b', 
    },{
        key: -4,
        hexCode: '#f48a0b', 
    },{
        key: -3,
        hexCode: '#f5a40c', 
    },{
        key: -2,
        hexCode: '#f5be0d', 
    },{
        key: -1,
        hexCode: '#f5d80e', 
    },{
        key: 0,
        hexCode: '#f5f20e', 
    },{
        key: 1,
        hexCode: '#f5df0e', 
    },{
        key: 2,
        hexCode: '#f5cc0d', 
    },{
        key: 3,
        hexCode: '#d2d50b', 
    },{
        key: 4,
        hexCode: '#aede09', 
    },{
        key: 5,
        hexCode: '#9ae308', 
    },{
        key: 6,
        hexCode: '#77ec05', 
    },{
        key: 7,
        hexCode: '#6bef04', 
    },{
        key: 8,
        hexCode: '#59f403', 
    },{
        key: 9,
        hexCode: '#47f802', 
    },{
        key: 10,
        hexCode: '#2cff00', 
    },]

    const colorPicker = () => {
        indexColors.map((color) => {
            if(color.key === props.teamIndex){
                setIndexColor(color.hexCode)
            }
        })
    }


    useEffect(() => {
        colorPicker()
    }, [props.gameData])
    
    return (
        <Col xs={3} style={{ fontSize: 'small',textAlign: 'center', alignContent: 'center', padding: '5px', borderStyle: 'solid', boxShadow:`inset 0 0 10px ${indexColor}` }}>
            {props.gameData.bookmakers.map((bookmaker) => {
                if(bookmaker.key === props.sportsbook){
                    return(
                        bookmaker.markets.map((market) => {
                            if(market.key === props.market){
                                return(
                                    market.outcomes.map((outcome) =>{
                                        let outcomeSplit = outcome.name.split(" ")
                                        let espnNameSplit = props.team.espnDisplayName.split(" ")
                                        if(outcome.name === props.team.espnDisplayName){
                                            return outcome.price < 0 ? outcome.price : `+${outcome.price}`
                                        }else if(outcome.name === props.total){
                                            return outcome.price < 0 ? outcome.price : `+${outcome.price}`
                                        }else if(outcomeSplit[outcomeSplit.length-1] === espnNameSplit[espnNameSplit.length-1]){
                                            return outcome.price < 0 ? outcome.price : `+${outcome.price}`
                                        }
                                    })
                                )
                            }
                        })
                    )
                }
            })}
        </Col>


    )
}

export default OddsDisplayBox