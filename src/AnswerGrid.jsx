import { useState } from 'react';

export default function AnswerGrid( {answer, index} ) {

    return (
        <section datalevel={index} className={answer}>
            {answer}
        </section>
    )
}