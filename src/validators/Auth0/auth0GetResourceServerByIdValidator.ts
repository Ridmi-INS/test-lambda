import * as yup from 'yup';
import { Auth0GetResourceServerById } from '../../types';
import { DEFAULT_ARRAY_MAX_LENGTH, defaultStringValidator } from '../constants';

export const auth0GetResourceServerByIdValidator: yup.ObjectSchema<Auth0GetResourceServerById> =
    yup.object({
        id: defaultStringValidator,
        name: defaultStringValidator,
        identifier: defaultStringValidator,
        scopes: yup
            .array()
            .max(DEFAULT_ARRAY_MAX_LENGTH)
            .defined()
            .of(
                yup.object({
                    value: defaultStringValidator,
                    description: defaultStringValidator,
                }),
            ),
    });
// not using exact because the underlying type deliberately does not include all the returned fields
