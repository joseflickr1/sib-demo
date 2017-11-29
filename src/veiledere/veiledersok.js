import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { settSokeresultat } from '../ducks/veiledere';
import { veilederShape } from './../proptype-shapes';
import { veiledereSok } from './veiledersok-utils';

function VeilederSokInput({ veiledere, oppdaterSokeresultat }) {
    return (
        <div className="veiledersok__input__wrapper">
            <input
                className="veiledersok__input skjemaelement__input input--fullbredde"
                type="text"
                onInput={(input) =>
                    oppdaterSokeresultat(
                        veiledereSok(input.currentTarget.value.toLowerCase(), veiledere))
                }
            />
        </div >
    )
        ;
}

VeilederSokInput.propTypes = {
    veiledere: PT.arrayOf(veilederShape).isRequired,
    oppdaterSokeresultat: PT.func.isRequired

};

const mapDispatchToProps = (dispatch) => ({
    oppdaterSokeresultat: (veiledere) => dispatch(settSokeresultat(veiledere))
});

export default connect(() => ({}), mapDispatchToProps)(VeilederSokInput);
