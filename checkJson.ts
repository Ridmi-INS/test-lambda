import * as yup from 'yup';
import fs from 'fs';
import { authDeclarationValidator } from './src/validators';

// this exists to check the file fits JSON formatting
// as a PR check
try {
    const str = fs.readFileSync('./authDeclaration.json', 'utf8');
    const auth = JSON.parse(str);
    authDeclarationValidator.validateSync(auth);
} catch (err) {
    if (!(err instanceof yup.ValidationError)) {
        console.error({ err });
        process.exit(1);
    }

    console.error({
        params: err.params,
        errors: err.errors,
    });

    process.exit(1);
}
